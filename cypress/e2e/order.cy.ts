import {IIngredient} from "../../utils/types";

describe('Drag and Drop Ingredients', () => {
    const testBun: IIngredient = {
        _id: '60d3b41abdacab0026a733c6',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0
    };

    const testFilling: IIngredient = {
        _id: '60d3b41abdacab0026a733c8',
        name: 'Филе Люминесцентного тетраодонтимформа',
        type: 'main',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        __v: 0
    };

    const BUN_SELECTOR = `[data-testid="ingredient-${testBun._id}"]`;
    const FILLING_SELECTOR = `[data-testid="ingredient-${testFilling._id}"]`;
    const CONSTRUCTOR_SELECTOR = '[data-testid="burger-constructor"]';
    const BUN_TOP_SELECTOR = '[data-testid="constructor-bun-top"]';
    const BUN_BOTTOM_SELECTOR = '[data-testid="constructor-bun-bottom"]';
    const FILLINGS_SELECTOR = '[data-testid="constructor-fillings"]';
    const ORDER_TOTAL_SELECTOR = '[data-testid="order-total"]';

    beforeEach(() => {
        cy.intercept('GET', 'api/ingredients', {
            statusCode: 200,
            body: {
                success: true,
                data: [testBun, testFilling]
            }
        });
        cy.visit('/');
    });

    it('should drag bun to constructor', () => {
        cy.get(BUN_SELECTOR).as('bun');
        cy.get(CONSTRUCTOR_SELECTOR).as('constructor');

        cy.get('@bun').trigger('dragstart');
        cy.get('@constructor').trigger('drop').trigger('dragend');

        cy.get(BUN_TOP_SELECTOR).should('contain', testBun.name);
        cy.get(BUN_BOTTOM_SELECTOR).should('contain', testBun.name);

        cy.get('@bun').should('contain', '2');
    });

    it('should drag filling to constructor', () => {
        cy.get(FILLING_SELECTOR).as('filling');
        cy.get(CONSTRUCTOR_SELECTOR).as('constructor');

        cy.get('@filling').trigger('dragstart');
        cy.get('@constructor').trigger('drop').trigger('dragend');

        cy.get(FILLINGS_SELECTOR).should('contain', testFilling.name);

        cy.get('@filling').should('contain', '1');
    });

    it('should update total price after adding ingredients', () => {
        cy.get(BUN_SELECTOR).trigger('dragstart');
        cy.get(CONSTRUCTOR_SELECTOR).trigger('drop').trigger('dragend');

        cy.get(FILLING_SELECTOR).trigger('dragstart');
        cy.get(CONSTRUCTOR_SELECTOR).trigger('drop').trigger('dragend');

        const expectedPrice = testBun.price * 2 + testFilling.price;

        cy.get(ORDER_TOTAL_SELECTOR).should('contain', expectedPrice);
    });
});

describe('Ingredient details Modal', () => {
    const testBun: IIngredient = {
        _id: '60d3b41abdacab0026a733c6',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0
    };

    const testFilling: IIngredient = {
        _id: '60d3b41abdacab0026a733c8',
        name: 'Филе Люминесцентного тетраодонтимформа',
        type: 'main',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        __v: 0
    };

    const BUN_SELECTOR = `[data-testid="ingredient-${testBun._id}"]`;
    const MODAL_SELECTOR = '[data-testid="modal"]';
    const MODAL_CROSS_SELECTOR = '[data-testid="modal-cross"]';

    beforeEach(() => {
        cy.intercept('GET', 'api/ingredients', {
            statusCode: 200,
            body: {
                success: true,
                data: [testBun, testFilling]
            }
        });

        cy.visit('/');
    });

    it('should open Modal when click on ingredient', () => {
        cy.get(BUN_SELECTOR).as('bun');

        cy.get('@bun').click();

        cy.get(MODAL_SELECTOR).as('modal');

        cy.get('@modal').within(() => {
            cy.contains('Калории,ккал').siblings().should('contain', testBun.calories);
            cy.contains('Белки, г').siblings().should('contain', testBun.proteins);
            cy.contains('Жиры, г').siblings().should('contain', testBun.fat);
            cy.contains('Углеводы, г').siblings().should('contain', testBun.carbohydrates);
        });

        cy.url().should('include', `/ingredients/${testBun._id}`);
    });

    it('should close Modal when click on cross', () => {
        cy.get(BUN_SELECTOR).as('bun');

        cy.get('@bun').click();

        cy.get(MODAL_SELECTOR).as('modal');

        cy.get('@modal').contains('Детали ингредиента');

        cy.get(MODAL_CROSS_SELECTOR).click();

        cy.get(MODAL_SELECTOR).should('not.exist');
    });
});

describe('Order Placement Flow', () => {
    const mockBun = {
        _id: '60d3b41abdacab0026a733c6',
        name: 'Краторная булка',
        type: 'bun',
        price: 1255,
        image: 'bun-image.png'
    };

    const mockFilling = {
        _id: '60d3b41abdacab0026a733c8',
        name: 'Соус Spicy',
        type: 'main',
        price: 90,
        image: 'sauce-image.png'
    };

    const mockOrderResponse = {
        name: 'Space флюоресцентный бургер',
        order: { number: 12345 },
        success: true
    };

    const BUN_SELECTOR = `[data-testid="ingredient-${mockBun._id}"]`;
    const FILLING_SELECTOR = `[data-testid="ingredient-${mockFilling._id}"]`;
    const CONSTRUCTOR_SELECTOR = '[data-testid="burger-constructor"]';
    const BUN_TOP_SELECTOR = '[data-testid="constructor-bun-top"]';
    const FILLINGS_SELECTOR = '[data-testid="constructor-fillings"]';
    const MODAL_SELECTOR = '[data-testid="modal"]';

    beforeEach(() => {
        cy.intercept('GET', 'api/ingredients', {
            body: { success: true, data: [mockBun, mockFilling] }
        });

        cy.intercept('POST', 'api/orders', {
            delay: 1000,
            body: mockOrderResponse
        }).as('postOrder');

        cy.visit('/');
    });

    it('should display order modal after successful order placement', () => {
        const mockUser = {
            email: 'test@example.com',
            name: 'Test User'
        };

        const mockLoginResponse = {
            success: true,
            user: mockUser,
            accessToken: 'Bearer test-access-token',
            refreshToken: 'test-refresh-token'
        };

        cy.intercept('POST', 'api/auth/login', mockLoginResponse).as('login');

        cy.visit('/login');
        cy.get('input[name=email]').type('test@example.com');
        cy.get('input[name=password]').type('password123');
        cy.get('button[type=submit]').click();
        cy.wait('@login');

        cy.get(BUN_SELECTOR).trigger('dragstart');
        cy.get(CONSTRUCTOR_SELECTOR).trigger('drop').trigger('dragend');

        cy.get(FILLING_SELECTOR).trigger('dragstart');
        cy.get(CONSTRUCTOR_SELECTOR).trigger('drop').trigger('dragend');

        cy.get('button').contains('Оформить заказ').click();

        cy.wait('@postOrder');

        cy.get(MODAL_SELECTOR).should('be.visible');
        cy.contains(`${mockOrderResponse.order.number}`).should('be.visible');

        cy.get(BUN_TOP_SELECTOR).should('contain', 'Выберите булку');
        cy.get(FILLINGS_SELECTOR).children().should('have.length', 0);
    });

    it('should redirect to login when unauthorized', () => {
        window.localStorage.removeItem('accessToken');

        cy.get(BUN_SELECTOR).trigger('dragstart');
        cy.get(CONSTRUCTOR_SELECTOR).trigger('drop').trigger('dragend');

        cy.get('button').contains('Оформить заказ').click();

        cy.url().should('include', '/login');
    });
});