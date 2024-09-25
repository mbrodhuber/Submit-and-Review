import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching submission:', error);
    } else {
      setSubmission(data);
    }
  };

  const handleApprove = async () => {
    await updateSubmissionStatus('approved');
  };

  const handleReject = async () => {
    await updateSubmissionStatus('rejected');
  };

  const updateSubmissionStatus = async (status) => {
    const { error } = await supabase
      .from('submissions')
      .update({ status: status, reviewer_feedback: feedback })
      .eq('id', id);

    if (error) {
      console.error('Error updating submission:', error);
    } else {
      navigate('/review');
    }
  };

  if (!submission) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Submission: {submission.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-bold">Description:</h3>
          <p>{submission.description}</p>
        </div>
        {/* Add more submission details here */}
        <div className="mb-4">
          <h3 className="font-bold">Reviewer Feedback:</h3>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback here..."
            className="mt-2"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={handleReject} variant="destructive">Reject</Button>
          <Button onClick={handleApprove}>Approve</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewPage;