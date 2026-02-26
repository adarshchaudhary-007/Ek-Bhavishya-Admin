import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserSearchInput } from './user-search-input'
import { PlatformUser } from '@/types'

const mockUsers: PlatformUser[] = [
    {
        _id: '1',
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        isVerified: true,
        accountStatus: 'Active',
        walletBalance: 100,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
    },
    {
        _id: '2',
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        phoneNumber: '0987654321',
        isVerified: true,
        accountStatus: 'Active',
        walletBalance: 200,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
    },
    {
        _id: '3',
        fullName: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        phoneNumber: '5555555555',
        isVerified: false,
        accountStatus: 'Blocked',
        walletBalance: 0,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
    },
]

describe('UserSearchInput', () => {
    it('should render search input with placeholder', () => {
        const onFilteredUsersChange = jest.fn()
        render(
            <UserSearchInput
                users={mockUsers}
                onFilteredUsersChange={onFilteredUsersChange}
            />
        )

        expect(screen.getByPlaceholderText('Search by name, email, or phone...')).toBeInTheDocument()
    })

    it('should filter users by full name (case-insensitive)', async () => {
        const onFilteredUsersChange = jest.fn()
        const user = userEvent.setup()

        render(
            <UserSearchInput
                users={mockUsers}
                onFilteredUsersChange={onFilteredUsersChange}
            />
        )

        const input = screen.getByPlaceholderText('Search by name, email, or phone...')
        await user.type(input, 'john')

        // Wait for debounce (300ms)
        await waitFor(
            () => {
                expect(onFilteredUsersChange).toHaveBeenCalledWith(
                    expect.arrayContaining([
                        expect.objectContaining({ fullName: 'John Doe' }),
                        expect.objectContaining({ fullName: 'Bob Johnson' }),
                    ])
                )
            },
            { timeout: 500 }
        )
    })

    it('should filter users by email (case-insensitive)', async () => {
        const onFilteredUsersChange = jest.fn()
        const user = userEvent.setup()

        render(
            <UserSearchInput
                users={mockUsers}
                onFilteredUsersChange={onFilteredUsersChange}
            />
        )

        const input = screen.getByPlaceholderText('Search by name, email, or phone...')
        await user.type(input, 'jane.smith')

        await waitFor(
            () => {
                expect(onFilteredUsersChange).toHaveBeenCalledWith([
                    expect.objectContaining({ email: 'jane.smith@example.com' }),
                ])
            },
            { timeout: 500 }
        )
    })

    it('should filter users by phone number', async () => {
        const onFilteredUsersChange = jest.fn()
        const user = userEvent.setup()

        render(
            <UserSearchInput
                users={mockUsers}
                onFilteredUsersChange={onFilteredUsersChange}
            />
        )

        const input = screen.getByPlaceholderText('Search by name, email, or phone...')
        await user.type(input, '5555')

        await waitFor(
            () => {
                expect(onFilteredUsersChange).toHaveBeenCalledWith([
                    expect.objectContaining({ phoneNumber: '5555555555' }),
                ])
            },
            { timeout: 500 }
        )
    })

    it('should show clear button when search term is entered', async () => {
        const onFilteredUsersChange = jest.fn()
        const user = userEvent.setup()

        render(
            <UserSearchInput
                users={mockUsers}
                onFilteredUsersChange={onFilteredUsersChange}
            />
        )

        const input = screen.getByPlaceholderText('Search by name, email, or phone...')
        
        // Clear button should not be visible initially
        expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()

        await user.type(input, 'test')

        // Clear button should be visible after typing
        expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
    })

    it('should clear search when clear button is clicked', async () => {
        const onFilteredUsersChange = jest.fn()
        const user = userEvent.setup()

        render(
            <UserSearchInput
                users={mockUsers}
                onFilteredUsersChange={onFilteredUsersChange}
            />
        )

        const input = screen.getByPlaceholderText('Search by name, email, or phone...') as HTMLInputElement
        await user.type(input, 'john')

        const clearButton = await screen.findByLabelText('Clear search')
        await user.click(clearButton)

        expect(input.value).toBe('')
        
        // After clearing, all users should be returned
        await waitFor(
            () => {
                expect(onFilteredUsersChange).toHaveBeenCalledWith(mockUsers)
            },
            { timeout: 500 }
        )
    })

    it('should return all users when search is empty', async () => {
        const onFilteredUsersChange = jest.fn()

        render(
            <UserSearchInput
                users={mockUsers}
                onFilteredUsersChange={onFilteredUsersChange}
            />
        )

        await waitFor(
            () => {
                expect(onFilteredUsersChange).toHaveBeenCalledWith(mockUsers)
            },
            { timeout: 500 }
        )
    })

    it('should return empty array when no users match search', async () => {
        const onFilteredUsersChange = jest.fn()
        const user = userEvent.setup()

        render(
            <UserSearchInput
                users={mockUsers}
                onFilteredUsersChange={onFilteredUsersChange}
            />
        )

        const input = screen.getByPlaceholderText('Search by name, email, or phone...')
        await user.type(input, 'nonexistent')

        await waitFor(
            () => {
                expect(onFilteredUsersChange).toHaveBeenCalledWith([])
            },
            { timeout: 500 }
        )
    })

    it('should debounce search input (300ms)', async () => {
        const onFilteredUsersChange = jest.fn()
        const user = userEvent.setup()

        render(
            <UserSearchInput
                users={mockUsers}
                onFilteredUsersChange={onFilteredUsersChange}
            />
        )

        const input = screen.getByPlaceholderText('Search by name, email, or phone...')
        
        // Type quickly
        await user.type(input, 'j')
        await user.type(input, 'o')
        await user.type(input, 'h')
        await user.type(input, 'n')

        // Should not filter immediately
        expect(onFilteredUsersChange).not.toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({ fullName: 'John Doe' }),
            ])
        )

        // Wait for debounce
        await waitFor(
            () => {
                expect(onFilteredUsersChange).toHaveBeenCalledWith(
                    expect.arrayContaining([
                        expect.objectContaining({ fullName: 'John Doe' }),
                        expect.objectContaining({ fullName: 'Bob Johnson' }),
                    ])
                )
            },
            { timeout: 500 }
        )
    })

    it('should use custom placeholder when provided', () => {
        const onFilteredUsersChange = jest.fn()
        const customPlaceholder = 'Find users...'

        render(
            <UserSearchInput
                users={mockUsers}
                onFilteredUsersChange={onFilteredUsersChange}
                placeholder={customPlaceholder}
            />
        )

        expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument()
    })

    it('should handle users with missing optional fields', async () => {
        const usersWithMissingFields: PlatformUser[] = [
            {
                _id: '1',
                fullName: '',
                email: 'test@example.com',
                phoneNumber: '1234567890',
                isVerified: true,
                accountStatus: 'Active',
                walletBalance: 0,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01',
            },
        ]

        const onFilteredUsersChange = jest.fn()
        const user = userEvent.setup()

        render(
            <UserSearchInput
                users={usersWithMissingFields}
                onFilteredUsersChange={onFilteredUsersChange}
            />
        )

        const input = screen.getByPlaceholderText('Search by name, email, or phone...')
        await user.type(input, 'test')

        await waitFor(
            () => {
                expect(onFilteredUsersChange).toHaveBeenCalledWith([
                    expect.objectContaining({ email: 'test@example.com' }),
                ])
            },
            { timeout: 500 }
        )
    })
})
