import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';

const fetchContract = async (contractId) => {
  const token = localStorage.getItem('access');
  const response = await axios.get(`http://127.0.0.1:8000/api/get-contracts/${contractId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchMilestone = async (milestoneId) => {
  const token = localStorage.getItem('access');
  const response = await axios.get(`http://127.0.0.1:8000/api/milestones/${milestoneId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const resolveDispute = async ({ data, drcForwardedItem, disputeId }) => {
  const token = localStorage.getItem('access');
  try {
    // Attempt to resolve the dispute
    const resolveResponse = await axios.post('http://127.0.0.1:8000/api/dispute-resolve-drc/', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Resolve response is", resolveResponse.data); // Success response

    // Update the DRC forwarded item to mark it as solved
    await axios.patch(
      `http://127.0.0.1:8000/api/drc-disputes/${drcForwardedItem.id}/`,
      { solved: true },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update the dispute status to resolved
    await axios.patch(
      `http://127.0.0.1:8000/api/disputes/${disputeId}/`,
      { status: 'resolved', got_response: true },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    // Log and throw the error details for further handling
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error status code:", error.response.status);
      console.error("Error headers:", error.response.headers);
      throw new Error(error.response.data.detail || "Failed to resolve dispute. Check the details.");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};


const ResolveDispute = () => {
  const { id: disputeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { drcForwardedItem, dispute } = location.state || {};
  const token = localStorage.getItem('access');

  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [refundType, setRefundType] = useState('full');
  const [refundAmount, setRefundAmount] = useState('');
  const [winner, setWinner] = useState('client');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { data: contract } = useQuery({
    queryKey: ['contract', dispute.contract],
    queryFn: () => fetchContract(dispute.contract),
    enabled: !!dispute.contract,
  });

  const { data: milestone } = useQuery({
    queryKey: ['milestone', dispute.milestone],
    queryFn: () => fetchMilestone(dispute.milestone),
    enabled: !!dispute.milestone,
  });

  const mutation = useMutation({
    mutationFn: (data) => resolveDispute(data),
    onSuccess: () => {
      setSuccess(true);
      navigate(`/dispute-events/${disputeId}` ,{
        state:{
          drcForwardedItem:drcForwardedItem
        }
      });
    },
    onError: () => {
      setError('Failed to submit resolved dispute. Please try again.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please provide a title for the resolved dispute.');
      return;
    }

    if (refundType === 'partial' && !refundAmount) {
      setError('Please specify the refund amount for a partial refund.');
      return;
    }

    setError(null);
    const data = {
      title,
      comment,
      return_type: refundType,
      drc_forwarded: drcForwardedItem.id,
      winner:winner === 'client' ? dispute.client : dispute.freelancer ,
      return_amount:
        refundType === 'partial'
          ? refundAmount
          : milestone
          ? milestone.amount
          : contract?.amount_agreed,
    };

    mutation.mutate({ data, drcForwardedItem, disputeId });
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-6">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6 text-center">
        Resolve Dispute
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">Resolved dispute submitted successfully!</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-lg font-normal text-brand-blue mb-2">
            Dispute Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter resolved dispute title..."
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="comment" className="block text-lg font-normal text-brand-blue mb-2">
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add any comments about the resolution..."
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none h-40 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="refundType" className="block text-lg font-normal text-brand-blue mb-2">
            Refund Type
          </label>
          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="full"
              name="refundType"
              value="full"
              checked={refundType === 'full'}
              onChange={() => setRefundType('full')}
              className="mr-2"
            />
            <label htmlFor="full" className="mr-4">
              Full Refund
            </label>
            <input
              type="radio"
              id="partial"
              name="refundType"
              value="partial"
              checked={refundType === 'partial'}
              onChange={() => setRefundType('partial')}
              className="mr-2"
            />
            <label htmlFor="partial">Partial Refund</label>
          </div>

          {refundType === 'partial' && (
            <div>
              <label htmlFor="refundAmount" className="block text-lg font-normal text-brand-blue mb-2">
                Amount for Partial Refund
              </label>
              <input
                type="number"
                id="refundAmount"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="winner" className="block text-lg font-normal text-brand-blue mb-2">
            Select the Winner of the Dispute
          </label>
          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="client"
              name="winner"
              value="client"
              checked={winner === 'client'}
              onChange={() => setWinner('client')}
              className="mr-2"
            />
            <label htmlFor="client" className="mr-4">
              Client
            </label>
            <input
              type="radio"
              id="freelancer"
              name="winner"
              value="freelancer"
              checked={winner === 'freelancer'}
              onChange={() => setWinner('freelancer')}
              className="mr-2"
            />
            <label htmlFor="freelancer">Freelancer</label>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className={`bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md ${
              mutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Submitting...' : 'Submit Resolution'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResolveDispute;
