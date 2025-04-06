import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Student",
    content: "IQify has helped me improve my problem-solving skills significantly. The practice questions are challenging and engaging!"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Teacher",
    content: "As an educator, I find IQify to be an invaluable tool for my students. The variety of questions and detailed explanations are excellent."
  },
  {
    id: 3,
    name: "Emily Williams",
    role: "Parent",
    content: "My children love using IQify. It's made learning fun and interactive for them!"
  }
];

export function Testimonials() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">What Our Users Say</h2>
          <p className="mt-4 text-lg text-gray-500">Don't just take our word for it - hear from our amazing community!</p>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                    {testimonial.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-gray-900">{testimonial.name}</h3>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 