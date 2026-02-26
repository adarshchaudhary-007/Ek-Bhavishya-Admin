/**
 * Integration Example: UserSearchInput Component
 * 
 * This file demonstrates how to integrate the UserSearchInput component
 * into the NoticeForm and UpdateNoticeModal components.
 * 
 * Requirements: 7.2, 7.5
 */

import { useState } from "react"
import { UserSearchInput } from "./user-search-input"
import { PlatformUser } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

/**
 * Example 1: Basic Integration in Notice Form
 * 
 * Replace the existing user selection section with this implementation
 */
export function NoticeFormUserSelectionExample() {
    const [users, setUsers] = useState<PlatformUser[]>([]) // Fetched from API
    const [filteredUsers, setFilteredUsers] = useState<PlatformUser[]>([])
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])

    return (
        <div className="space-y-4">
            {/* Add search input above the user list */}
            <UserSearchInput
                users={users}
                onFilteredUsersChange={setFilteredUsers}
                placeholder="Search by name, email, or phone..."
            />

            {/* Display filtered users */}
            <div className="border rounded-md p-4 max-h-64 overflow-y-auto space-y-2">
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                        No users found
                    </div>
                ) : (
                    <>
                        <div className="flex items-center space-x-2 pb-2 border-b">
                            <Checkbox
                                id="select-all"
                                checked={selectedUsers.length === filteredUsers.length}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setSelectedUsers(filteredUsers.map(u => u._id))
                                    } else {
                                        setSelectedUsers([])
                                    }
                                }}
                            />
                            <Label htmlFor="select-all" className="font-semibold cursor-pointer">
                                Select All ({filteredUsers.length} users)
                            </Label>
                        </div>
                        {filteredUsers.map((user) => (
                            <div key={user._id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={user._id}
                                    checked={selectedUsers.includes(user._id)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedUsers([...selectedUsers, user._id])
                                        } else {
                                            setSelectedUsers(selectedUsers.filter(id => id !== user._id))
                                        }
                                    }}
                                />
                                <Label htmlFor={user._id} className="font-normal cursor-pointer flex-1">
                                    <div className="flex flex-col">
                                        <span className="text-sm">{user.fullName || user.email}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                        {user.phoneNumber && (
                                            <span className="text-xs text-muted-foreground">{user.phoneNumber}</span>
                                        )}
                                    </div>
                                </Label>
                            </div>
                        ))}
                    </>
                )}
            </div>
            <p className="text-sm text-muted-foreground">
                {selectedUsers.length} user(s) selected
            </p>
        </div>
    )
}

/**
 * Example 2: Integration in NoticeForm (Complete Section)
 * 
 * This shows the complete "specific users" section with search functionality
 */
export function CompleteNoticeFormIntegration() {
    // In the actual NoticeForm component, add this state:
    const [filteredUsers, setFilteredUsers] = useState<PlatformUser[]>([])

    // Then modify the "specific users" section like this:
    return (
        <>
            {/* When userSelection === "specific", show this: */}
            <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Select Users</label>
                    
                    {/* Add the search input */}
                    <UserSearchInput
                        users={[]} // Pass the users array from state
                        onFilteredUsersChange={setFilteredUsers}
                    />
                </div>

                {/* Update the user list to use filteredUsers instead of users */}
                <div className="border rounded-md p-4 max-h-64 overflow-y-auto space-y-2">
                    {/* ... rest of the user list implementation using filteredUsers ... */}
                </div>
            </div>
        </>
    )
}

/**
 * Example 3: Integration Steps for NoticeForm
 * 
 * Step 1: Import the component
 * import { UserSearchInput } from "@/components/notices/user-search-input"
 * 
 * Step 2: Add state for filtered users
 * const [filteredUsers, setFilteredUsers] = useState<PlatformUser[]>([])
 * 
 * Step 3: Initialize filteredUsers when users are loaded
 * useEffect(() => {
 *   setFilteredUsers(users)
 * }, [users])
 * 
 * Step 4: Add the search input before the user list (around line 240)
 * <UserSearchInput
 *   users={users}
 *   onFilteredUsersChange={setFilteredUsers}
 * />
 * 
 * Step 5: Replace all references to 'users' in the user list with 'filteredUsers'
 * - In the "Select All" checkbox: filteredUsers.length
 * - In the map function: filteredUsers.map((user) => ...)
 * - In the "No users found" condition: filteredUsers.length === 0
 */

/**
 * Example 4: Integration in UpdateNoticeModal
 * 
 * The same pattern applies to the UpdateNoticeModal component:
 * 1. Import UserSearchInput
 * 2. Add filteredUsers state
 * 3. Add the search input above the user list
 * 4. Replace users with filteredUsers in the list rendering
 */
