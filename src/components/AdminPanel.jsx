import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { assignUserRole } from '../utils/userManagement';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Select } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";


const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('auth.users')
      .select('id, email, role');
    if (error) console.error('Error fetching users:', error);
    else setUsers(data);
  };

  const handleRoleChange = async (userId, newRole) => {
    const success = await assignUserRole(userId, newRole);
    if (success) {
      setUsers(users.map(user => 
        user.id === userId ? {...user, role: newRole} : user
      ));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">This is the admin panel where you can manage users and system settings.</p>

        <h2 className="text-xl font-semibold mb-2">User Management</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Change Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="author">Author</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="admin">Admin</option>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;