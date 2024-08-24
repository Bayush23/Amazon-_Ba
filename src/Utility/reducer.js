import { Type } from "./action.type";

export const initialState = {
	basket: [],
	user: null,
};

export const reducer = (state, action) => {
	switch (action.type) {
		case Type.ADD_TO_BASKET:
			return addToBasket(state, action.item);

		case Type.REMOVE_FROM_BASKET:
			return removeFromBasket(state, action.id);

		case Type.SET_USER:
			return {
				...state,
				user: action.user,
			};

		case Type.EMPTY_BASKET:
			return {
				...state,
				basket: [],
			};

		default:
			return state;
	}
};

// Helper function to add item to basket
const addToBasket = (state, itemToAdd) => {
	const updatedBasket = [...state.basket];
	const existingItemIndex = updatedBasket.findIndex(
		(item) => item.id === itemToAdd.id
	);

	if (existingItemIndex !== -1) {
		updatedBasket[existingItemIndex] = {
			...updatedBasket[existingItemIndex],
			amount: updatedBasket[existingItemIndex].amount + 1,
		};
	} else {
		updatedBasket.push({ ...itemToAdd, amount: 1 });
	}

	return {
		...state,
		basket: updatedBasket,
	};
};

// Helper function to remove item from basket
const removeFromBasket = (state, itemIdToRemove) => {
	const updatedBasket = [...state.basket];
	const existingItemIndex = updatedBasket.findIndex(
		(item) => item.id === itemIdToRemove
	);

	if (existingItemIndex !== -1) {
		if (updatedBasket[existingItemIndex].amount > 1) {
			updatedBasket[existingItemIndex] = {
				...updatedBasket[existingItemIndex],
				amount: updatedBasket[existingItemIndex].amount - 1,
			};
		} else {
			updatedBasket.splice(existingItemIndex, 1);
		}
	}

	return {
		...state,
		basket: updatedBasket,
	};
};
