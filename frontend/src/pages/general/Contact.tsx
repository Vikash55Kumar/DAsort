import React, { useState } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { validateEmail, validateRequired } from '../../utils/validators';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameError = validateRequired(formData.name, 'Name');
    if (nameError) newErrors.name = nameError;

    const emailError = validateRequired(formData.email, 'Email');
    if (emailError) {
      newErrors.email = emailError;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const subjectError = validateRequired(formData.subject, 'Subject');
    if (subjectError) newErrors.subject = subjectError;

    const messageError = validateRequired(formData.message, 'Message');
    if (messageError) newErrors.message = messageError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank you for your message!</h1>
            <p className="text-lg text-gray-600 mb-8">
              We've received your inquiry and will get back to you within 24 hours.
            </p>
            <Button onClick={() => setSubmitted(false)}>
              Send Another Message
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">
            Have questions about the NCO AI Classification system? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                placeholder="Enter your full name"
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="Enter your email address"
                required
              />

              <Input
                label="Subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                error={errors.subject}
                placeholder="What is this regarding?"
                required
              />

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us more about your inquiry..."
                  className={`block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.message ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Ministry Office</h4>
                  <p className="text-gray-600">
                    Ministry of Statistics and Programme Implementation<br />
                    Government of India<br />
                    Sardar Patel Bhavan, New Delhi
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Email Support</h4>
                  <p className="text-gray-600">
                    Technical Support: <a href="mailto:support@mospi.gov.in" className="text-blue-600 hover:text-blue-500">support@mospi.gov.in</a><br />
                    General Inquiries: <a href="mailto:info@mospi.gov.in" className="text-blue-600 hover:text-blue-500">info@mospi.gov.in</a>
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Office Hours</h4>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                    Saturday: 9:00 AM - 1:00 PM IST<br />
                    Sunday: Closed
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Helpful Links</h4>
                  <div className="space-y-2">
                    <a href="https://mospi.gov.in" target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:text-blue-500">
                      Official MoSPI Website
                    </a>
                    <a href="https://esankhyiki.mospi.gov.in" target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:text-blue-500">
                      eSankhyiki Portal
                    </a>
                    <a href="https://datainnovation.mospi.gov.in" target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:text-blue-500">
                      Data Innovation Center
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
