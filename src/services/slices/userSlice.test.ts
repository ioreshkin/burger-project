import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
    userSlice,
    fetchLogin,
    fetchLogout,
    fetchRegister,
    fetchForgotPassword,
    fetchResetPassword,
    fetchGetUser,
    fetchPatchUser
} from './userSlice';
import {requestWithAuth} from "../request.ts";

vi.mock('../request', () => ({
    requestWithAuth: vi.fn()
}));

const mockedRequestWithAuth = vi.mocked(requestWithAuth);

describe('userSlice', () => {
    const initialState = userSlice.getInitialState();

    beforeEach(() => {
        vi.spyOn(Storage.prototype, 'setItem');
        vi.spyOn(Storage.prototype, 'getItem');
        vi.spyOn(Storage.prototype, 'removeItem');
        vi.spyOn(Storage.prototype, 'clear');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const mockUser = {
        email: 'test@example.com',
        name: 'Test User'
    };

    const mockAuthResponse = {
        accessToken: 'Bearer test-access-token',
        refreshToken: 'test-refresh-token'
    };

    describe('extraReducers', () => {
        describe('fetchGetUser', () => {
            it('should handle pending state', () => {
                const action = { type: fetchGetUser.pending.type };
                const state = userSlice.reducer(initialState, action);
                expect(state).toEqual({
                    ...initialState,
                    status: 'loading',
                    error: ''
                });
            });

            it('should handle fulfilled state', () => {
                const action = {
                    type: fetchGetUser.fulfilled.type,
                    payload: { success: true, user: mockUser }
                };
                const state = userSlice.reducer(initialState, action);
                expect(state).toEqual({
                    ...initialState,
                    status: 'succeeded',
                    user: mockUser,
                    isLoggedIn: true
                });
            });

            it('should handle rejected state', () => {
                const errorMessage = 'Failed to fetch user';
                const action = {
                    type: fetchGetUser.rejected.type,
                    payload: errorMessage
                };
                const state = userSlice.reducer(initialState, action);
                expect(state).toEqual({
                    ...initialState,
                    status: 'failed',
                    error: errorMessage,
                    user: initialState.user,
                    isLoggedIn: false
                });
            });
        });

        describe('fetchLogin', () => {
            it('should set tokens in localStorage on successful login', () => {
                const action = {
                    type: fetchLogin.fulfilled.type,
                    payload: {
                        accessToken: 'Bearer test-token',
                        refreshToken: 'refresh-token',
                        user: { email: 'test@test.com', name: 'Test' },
                        success: true
                    }
                };

                userSlice.reducer(initialState, action);

                expect(Storage.prototype.setItem).toHaveBeenCalledWith(
                    'accessToken',
                    'test-token'
                );
                expect(Storage.prototype.setItem).toHaveBeenCalledWith(
                    'refreshToken',
                    'refresh-token'
                );
            });
        });

        describe('fetchLogout', () => {
            it('should remove tokens from localStorage on logout', () => {
                vi.mocked(Storage.prototype.getItem).mockReturnValueOnce('refresh-token');

                const action = { type: fetchLogout.fulfilled.type };
                userSlice.reducer(initialState, action);

                expect(Storage.prototype.removeItem).toHaveBeenCalledWith('accessToken');
                expect(Storage.prototype.removeItem).toHaveBeenCalledWith('refreshToken');
            });
        });

        describe('fetchRegister', () => {
            it('should handle fulfilled state and set tokens', () => {
                const action = {
                    type: fetchRegister.fulfilled.type,
                    payload: {
                        ...mockAuthResponse,
                        user: mockUser,
                        success: true
                    }
                };
                const state = userSlice.reducer(initialState, action);

                expect(state).toEqual({
                    ...initialState,
                    status: 'succeeded',
                    user: mockUser,
                    isLoggedIn: true
                });
                expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'test-access-token');
                expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'test-refresh-token');
            });
        });

        describe('password reset flow', () => {
            it('should set isResettingPassword on fetchForgotPassword fulfilled', () => {
                const action = {
                    type: fetchForgotPassword.fulfilled.type,
                    payload: { success: true, message: 'Reset email sent' }
                };
                const state = userSlice.reducer(initialState, action);
                expect(state.isResettingPassword).toBe(true);
            });

            it('should clear isResettingPassword on fetchResetPassword fulfilled', () => {
                const prevState = {
                    ...initialState,
                    isResettingPassword: true
                };

                const action = {
                    type: fetchResetPassword.fulfilled.type,
                    payload: { success: true, message: 'Password reset' }
                };
                const state = userSlice.reducer(prevState, action);
                expect(state.isResettingPassword).toBe(false);
            });
        });
    });

    describe('thunks', () => {
        describe('fetchPatchUser', () => {
            it('should not include password in request when empty', async () => {
                const mockResponse = {
                    success: true,
                    user: {
                        email: 'test@test.com',
                        name: 'Test User'
                    }
                };

                mockedRequestWithAuth.mockResolvedValue(mockResponse);

                const userData = {
                    name: 'Test User',
                    email: 'test@test.com',
                    password: ''
                };

                const dispatch = vi.fn();
                const getState = vi.fn();
                await fetchPatchUser(userData)(dispatch, getState, undefined);

                expect(requestWithAuth).toHaveBeenCalledWith(
                    'auth/user',
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer test-access-token'
                        },
                        body: JSON.stringify({
                            name: 'Test User',
                            email: 'test@test.com'
                        })
                    }
                );
            });
        });
    });
});