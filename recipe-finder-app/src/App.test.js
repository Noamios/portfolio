import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const mockMeal = {
  idMeal: '52772',
  strMeal: 'Teriyaki Chicken Casserole',
  strCategory: 'Chicken',
  strArea: 'Japanese',
  strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
  strInstructions: 'Bake and serve.',
  strIngredient1: 'Chicken',
  strMeasure1: '500g',
  strIngredient2: 'Soy sauce',
  strMeasure2: '3 tbsp'
};

beforeEach(() => {
  jest.restoreAllMocks();
  localStorage.clear();
});

test('searching recipes shows returned meals', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    json: async () => ({ meals: [mockMeal] })
  });

  render(<App />);

  await userEvent.type(screen.getByLabelText(/search recipes/i), 'chicken');
  await userEvent.click(screen.getByRole('button', { name: /search/i }));

  expect(await screen.findByText('Teriyaki Chicken Casserole')).toBeInTheDocument();
  expect(screen.getByText('Chicken')).toBeInTheDocument();
});

test('shows no results message when API returns no meals', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    json: async () => ({ meals: null })
  });

  render(<App />);

  await userEvent.type(screen.getByLabelText(/search recipes/i), 'unknown dish');
  await userEvent.click(screen.getByRole('button', { name: /search/i }));

  expect(await screen.findByText(/no recipes found/i)).toBeInTheDocument();
});

test('favorites toggle updates and persists to localStorage', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    json: async () => ({ meals: [mockMeal] })
  });

  const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
  render(<App />);

  await userEvent.type(screen.getByLabelText(/search recipes/i), 'chicken');
  await userEvent.click(screen.getByRole('button', { name: /search/i }));
  await screen.findByText('Teriyaki Chicken Casserole');

  const favoriteButton = screen.getAllByRole('button', { name: /favorite/i })[0];
  await userEvent.click(favoriteButton);

  expect(await screen.findByText(/your favorites \(1\)/i)).toBeInTheDocument();
  expect(setItemSpy).toHaveBeenCalledWith(
    'favorites',
    expect.stringContaining('"idMeal":"52772"')
  );
});
