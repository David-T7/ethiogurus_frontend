import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ResolveDispute = () => {
  const { id: disputeId } = useParams(); // Get contract ID from URL
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [refundType, setRefundType] = useState('full'); // 'full' or 'partial'
  const [refundAmount, setRefundAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [winner, setWinner] = useState('client'); // default to 'client' or 'freelancer'
  const [contract  ,setContract ]= useState(null)
  const token = localStorage.getItem('access');
  const { drcForwardedItem , dispute } = location.state || {};
  const [milestone , setMilestone] = useState()


  useEffect(() => {
    // Fetch contract details using axios
    const fetchContract = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/get-contracts/${dispute.contract}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token
            },
          }
        );

        setContract(response.data); // Set the fetched contract data
      } catch (err) {
        setError(err.response ? err.response.data.detail : "An error occurred");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchContract();
  }, [dispute]);


  useEffect(() => {
    // Fetch contract details using axios
    const fetchMilestone = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/milestones/${dispute.milestone}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token
            },
          }
        );

        setMilestone(response.data); // Set the fetched contract data
      } catch (err) {
        setError(err.response ? err.response.data.detail : "An error occurred");
      } finally {
        setLoading(false); // Stop loading
      }
    };
    if(dispute.milestone){
    fetchMilestone();
    }
  }, [dispute]);


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim()) {
      setError('Please provide a title for the resolved dispute.');
      return;
    }
    if (refundType === 'partial' && !refundAmount) {
      setError('Please specify the refund amount for a partial refund.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);


   // Create data object
const data = {
    title,
    comment,
    return_type: refundType,
    drc_forwarded: drcForwardedItem.id,
    winner,
  };
  
  // Set return_amount based on refundType and milestone/contract values
  if (refundType === "partial") {
    data.return_amount = refundAmount;
  } else if (refundType === "full") {
    // Check if milestone and contract exist before accessing properties
    data.return_amount = milestone ? milestone.amount : contract.amount_agreed;
  }

    try {
      // Send POST request to create resolved dispute
      const response = await axios.post(
        'http://127.0.0.1:8000/api/dispute-resolve-drc/',
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );


      await axios.patch(`http://127.0.0.1:8000/api/drc-disputes/${drcForwardedItem.id}/`, {
        solved: true,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });


      await axios.patch(`http://127.0.0.1:8000/api/disputes/${disputeId}/`, {
        status: 'resolved',
        got_response : true
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });



      console.log('Resolved dispute submitted successfully:', response.data);
      setSuccess(true);

      // Optionally, reset the form
      setTitle('');
      setComment('');
      setRefundType('full');
      setRefundAmount('');

      // Redirect to contract details page to reflect changes
      navigate(`/drc-dispute-events/${disputeId}`);
    } catch (err) {
      console.error('Error submitting resolved dispute:', err);
      setError('Failed to submit resolved dispute. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-6">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6 text-center">
        Resolve Dispute
      </h1>

      {/* Display Error Message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Display Success Message */}
      {success && <div className="text-green-500 mb-4">Resolved dispute submitted successfully!</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dispute Title */}
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

        {/* Dispute Comment */}
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

        {/* Refund Type */}
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
            <label htmlFor="full" className="mr-4">Full Refund</label>
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
                required={refundType === 'partial'}
              />
            </div>
          )}
        </div>

         {/* Winner Selection */}
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
              checked={winner === contract?.client}
              onChange={() => setWinner(contract.client)}
              className="mr-2"
            />
            <label htmlFor="client" className="mr-4">Client</label>
            <input
              type="radio"
              id="freelancer"
              name="winner"
              value="freelancer"
              checked={winner === contract?.freelancer}
              onChange={() => setWinner(contract.freelancer)}
              className="mr-2"
            />
            <label htmlFor="freelancer">Freelancer</label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className={`bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Resolution'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResolveDispute;
