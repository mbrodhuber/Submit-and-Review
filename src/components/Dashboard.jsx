import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const Dashboard = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [newSubmission, setNewSubmission] = useState({ title: '', description: '' });

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert([
          { ...newSubmission, user_id: user.id, status: 'pending' }
        ]);

      if (error) throw error;

      setSubmissions([...submissions, data[0]]);
      setNewSubmission({ title: '', description: '' });
    } catch (error) {
      console.error('Error creating submission:', error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Submission</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title"
                value={newSubmission.title}
                onChange={(e) => setNewSubmission({...newSubmission, title: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={newSubmission.description}
                onChange={(e) => setNewSubmission({...newSubmission, description: e.target.value})}
                required
              />
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <p>You haven't made any submissions yet.</p>
          ) : (
            <ul className="space-y-4">
              {submissions.map((submission) => (
                <li key={submission.id} className="border p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{submission.title}</h3>
                    <Badge className={getStatusColor(submission.status)}>
                      {submission.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mt-2">{submission.description}</p>
                  <Button className="mt-2">View Details</Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;