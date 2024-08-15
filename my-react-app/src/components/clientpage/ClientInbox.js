import { useNavigate } from 'react-router-dom';
import profilePic from '../../images/default-profile-picture.png'; // Replace with actual profile picture
import ClientLayout from './ClientLayoutPage';
import Inbox from '../Inbox';
const ClientInbox = () => {
  // Dummy data for freelancers and messages (replace with real data from API)
  const freelancers = [
    {
      id: 1,
      name: 'Jane Doe',
      profilePic: profilePic,
      lastMessage: 'Looking forward to working with you!',
      timestamp: '2024-08-13T15:30:00Z'
    },
    {
      id: 2,
      name: 'John Smith',
      profilePic: profilePic,
      lastMessage: 'Please review the proposal I sent.',
      timestamp: '2024-08-12T10:20:00Z'
    },
    {
      id: 3,
      name: 'Alice Johnson',
      profilePic: profilePic,
      lastMessage: 'Can we schedule a meeting for tomorrow?',
      timestamp: '2024-08-11T09:00:00Z'
    },
  ];

  const navigate = useNavigate()

  const handleSelect = (id) => {
    navigate("/contact-freelancer/{id}")
  }


  return (
    <ClientLayout>
    <Inbox users={freelancers} handleSelect={handleSelect}></Inbox>
    </ClientLayout>

  );
};

export default ClientInbox;
