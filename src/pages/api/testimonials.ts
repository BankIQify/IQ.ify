export async function GET() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Student",
      image: "/avatars/student-1.jpg",
      content: "IQify has helped me improve my problem-solving skills significantly. The practice questions are challenging and engaging!"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Teacher",
      image: "/avatars/teacher-1.jpg",
      content: "As an educator, I find IQify to be an invaluable tool for my students. The variety of questions and detailed explanations are excellent."
    },
    {
      id: 3,
      name: "Emily Williams",
      role: "Parent",
      image: "/avatars/parent-1.jpg",
      content: "My children love using IQify. It's made learning fun and interactive for them!"
    }
  ];

  return new Response(JSON.stringify(testimonials), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
} 