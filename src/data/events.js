/* ============================================
   COMMONGROUND – EVENTS MOCK DATA
   ============================================ */

import potteryImg from '../assets/hobbies/hobby_pottery_1786871778302.jpg';
import guitarImg from '../assets/hobbies/hobby_guitar_1786871505903.jpg';
import drawingImg from '../assets/hobbies/hobby_drawing_1786872318655.jpg';
import runningImg from '../assets/hobbies/hobby_running_1786871855685.jpg';
import photographyImg from '../assets/hobbies/hobby_photography_1786871191346.jpg';
import cookingImg from '../assets/hobbies/hobby_cooking_1786872493583.jpg';
import filmImg from '../assets/hobbies/hobby_film_1786871879712.jpg';
import aimlImg from '../assets/hobbies/hobby_aiml_1786872114650.jpg';

// Events stored in Supabase keep only an image key; these map it back to the bundled art
export const eventImages = {
  pottery: potteryImg,
  guitar: guitarImg,
  drawing: drawingImg,
  running: runningImg,
  photography: photographyImg,
  cooking: cookingImg,
  film: filmImg,
  aiml: aimlImg,
};

export const events = [
  {
    id: 'evt-1',
    title: 'Pottery Workshop 🏺',
    category: 'Workshop',
    date: 'Sat, 24 May 2025',
    time: '3:00 PM – 5:00 PM',
    locationType: 'in-person',
    location: 'Chandigarh, India',
    description: 'Get your hands dirty and create something beautiful!',
    interested: 24,
    imageKey: 'pottery',
    image: potteryImg,
  },
  {
    id: 'evt-2',
    title: 'Guitar Basics Workshop 🎸',
    category: 'Workshop',
    date: 'Sun, 25 May 2025',
    time: '11:00 AM – 1:00 PM',
    locationType: 'online',
    location: null,
    description: 'Learn the basics and play your first song!',
    interested: 18,
    imageKey: 'guitar',
    image: guitarImg,
  },
  {
    id: 'evt-3',
    title: 'K-Pop Dance Class 💃',
    category: 'Dance',
    date: 'Sat, 31 May 2025',
    time: '4:00 PM – 6:00 PM',
    locationType: 'in-person',
    location: 'Chandigarh, India',
    description: 'Fun, energetic and beginner friendly!',
    interested: 31,
    imageKey: 'drawing',
    image: drawingImg,
  },
  {
    id: 'evt-4',
    title: 'Watercolor Painting Meetup 🎨',
    category: 'Meetup',
    date: 'Sun, 1 Jun 2025',
    time: '10:00 AM – 12:00 PM',
    locationType: 'in-person',
    location: 'Chandigarh, India',
    description: "Let's paint, chill and connect!",
    interested: 27,
    imageKey: 'photography',
    image: photographyImg,
  },
  {
    id: 'evt-5',
    title: 'Morning Yoga Session 🧘',
    category: 'Meetup',
    date: 'Sun, 1 Jun 2025',
    time: '7:00 AM – 8:00 AM',
    locationType: 'in-person',
    location: 'Sukhna Lake, Chandigarh',
    description: 'Start your day with positive energy!',
    interested: 15,
    imageKey: 'running',
    image: runningImg,
  },
  {
    id: 'evt-6',
    title: 'Film Photography Walk 📷',
    category: 'Local',
    date: 'Sat, 7 Jun 2025',
    time: '9:00 AM – 11:00 AM',
    locationType: 'in-person',
    location: 'Sector 17, Chandigarh',
    description: 'Bring your film camera and explore the city together!',
    interested: 22,
    imageKey: 'film',
    image: filmImg,
  },
  {
    id: 'evt-7',
    title: 'Intro to Cooking 🍳',
    category: 'Workshop',
    date: 'Sun, 8 Jun 2025',
    time: '2:00 PM – 4:00 PM',
    locationType: 'online',
    location: null,
    description: 'Master simple recipes you will actually want to eat.',
    interested: 19,
    imageKey: 'cooking',
    image: cookingImg,
  },
  {
    id: 'evt-8',
    title: 'AI & Art Night 🤖',
    category: 'Online',
    date: 'Fri, 13 Jun 2025',
    time: '7:00 PM – 9:00 PM',
    locationType: 'online',
    location: null,
    description: 'Where machine creativity meets human curiosity.',
    interested: 34,
    imageKey: 'aiml',
    image: aimlImg,
  },
];

export const categories = [
  { label: 'All', value: 'all', accent: null },
  { label: 'Workshop', value: 'Workshop', accent: 'yellow' },
  { label: 'Meetup', value: 'Meetup', accent: 'green' },
  { label: 'Online', value: 'Online', accent: 'blue' },
  { label: 'Local', value: 'Local', accent: 'pink' },
  { label: 'Music', value: 'Music', accent: 'purple' },
  { label: 'Art', value: 'Art', accent: 'orange' },
  { label: 'Dance', value: 'Dance', accent: 'red' },
  { label: 'Craft', value: 'Craft', accent: 'green' },
];
