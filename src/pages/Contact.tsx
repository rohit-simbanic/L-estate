import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { FormField } from '../components/ui/FormField';
import { Map } from '../features/search/Map';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Mail, Phone, Send, CheckCircle2, Clock } from 'lucide-react';

// Contact form schema
const contactSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Please provide your name so our concierge desk can address you correctly.',
    })
    .min(3, { message: 'Your name must contain at least 3 characters.' }),
  email: z
    .string()
    .min(1, { message: 'An email address is required to dispatch your proposal.' })
    .email({
      message: 'This email address is invalid. Please verify the format (e.g., vip@domain.com).',
    }),
  phone: z
    .string()
    .min(1, { message: 'Please provide a contact phone number for VIP direct routing.' })
    .min(8, { message: 'Your phone number must contain at least 8 digits.' }),
  subject: z.enum(['General Inquiry', 'Host Cooperation', 'VIP Concierge Booking']),
  message: z
    .string()
    .min(1, { message: 'Please describe your destination preferences or partnership proposal.' })
    .min(10, {
      message: 'Your message is too brief. Please provide details of at least 10 characters.',
    }),
});

type ContactFormInputs = z.infer<typeof contactSchema>;

export const Contact: React.FC = () => {
  useDocumentTitle(
    'Contact Concierge',
    "Connect with the L'ESTATE elite lifestyle concierge desk.",
  );
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [formData, setFormData] = useState<ContactFormInputs | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: 'General Inquiry',
      message: '',
    },
  });

  const onSubmit = (data: ContactFormInputs) => {
    setFormData(data);
    setSuccessModalOpen(true);
    reset(); // Clear form on submit
  };

  // Mock property coordinate for the Geneva headquarters office location on Leaflet Map
  const hqOfficeCoords = {
    id: 'hq-office',
    title: "L'ESTATE Global Headquarters",
    type: 'Mansion' as const,
    location: 'Geneva, Switzerland',
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    coordinates: [46.2044, 6.1432] as [number, number],
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    ],
    description: 'Corporate Headquarters',
    rating: 5,
    reviewsCount: 1,
    amenities: [],
    host: { name: "L'ESTATE", image: '', rating: 5 },
  };

  return (
    <div className="w-full text-left py-12 pb-24 max-w-7xl mx-auto px-6">
      {/* Header */}
      <section className="mb-16">
        <span className="text-gold-600 text-xs font-bold uppercase tracking-widest block mb-3">
          GET IN TOUCH
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-obsidian-900 max-w-2xl leading-tight">
          We Are At Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 font-bold">
            Absolute Disposal
          </span>
        </h1>
      </section>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left column: Contact Info (5/12 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-gold-600">Concierge Desk</h3>
            <p className="text-xs text-obsidian-750 text-obsidian-700 leading-relaxed font-light">
              Whether you wish to reserve a beachfront estate in Saint-Tropez or enquire about
              listing your private castle, our concierge agents stand ready to curate your requests.
            </p>
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex gap-4">
              <div className="p-3 rounded-full bg-obsidian-50 border border-obsidian-200 text-gold-600 flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-obsidian-900">Hotline Services</h4>
                <p className="text-xs text-gold-600 font-bold mt-1">+41 (0) 22 310 12 12</p>
                <p className="text-[10px] text-obsidian-550 text-obsidian-500 mt-0.5">
                  24 hours globally • VIP direct routing
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 rounded-full bg-obsidian-50 border border-obsidian-200 text-gold-600 flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-obsidian-900">General & VIP Inquiries</h4>
                <p className="text-xs text-gold-600 font-bold mt-1">concierge@lestate.com</p>
                <p className="text-[10px] text-obsidian-550 text-obsidian-500 mt-0.5">
                  Response target under 15 minutes
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 rounded-full bg-obsidian-50 border border-obsidian-200 text-gold-600 flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-obsidian-900">Operational Desk Hours</h4>
                <p className="text-xs text-obsidian-800 mt-1">Monday – Sunday • 24/7</p>
                <p className="text-[10px] text-obsidian-550 text-obsidian-500 mt-0.5">
                  Always awake to coordinate your travels
                </p>
              </div>
            </div>
          </div>

          {/* Interactive HQ Map */}
          <div className="space-y-3 pt-4">
            <h4 className="text-xs font-bold text-obsidian-600">Geneva HQ Office Location</h4>
            <div className="h-56 rounded-2xl overflow-hidden border border-obsidian-200">
              <Map
                properties={[hqOfficeCoords]}
                center={hqOfficeCoords.coordinates}
                zoom={13}
                interactive={false}
              />
            </div>
          </div>
        </div>

        {/* Right column: Form (7/12 cols) */}
        <div className="lg:col-span-7 bg-white border border-obsidian-200 rounded-2xl p-6 sm:p-8 shadow-xl">
          <h3 className="font-serif text-xl font-bold text-gold-600 mb-6">Send An Inquiry</h3>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <FormField
                id="name"
                label="Your Name"
                placeholder="e.g. Jean-Pierre"
                error={errors.name}
                registerProps={register('name')}
              />

              {/* Email */}
              <FormField
                id="email"
                label="Your Email"
                type="email"
                placeholder="name@email.com"
                error={errors.email}
                registerProps={register('email')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Phone */}
              <FormField
                id="phone"
                label="Phone Number"
                placeholder="+41 22 123 4567"
                error={errors.phone}
                registerProps={register('phone')}
              />

              {/* Inquiry Type */}
              <FormField
                id="subject"
                label="Inquiry Type"
                fieldType="select"
                error={errors.subject}
                registerProps={register('subject')}
                options={[
                  { value: 'General Inquiry', label: 'General Inquiry' },
                  { value: 'Host Cooperation', label: 'Host Cooperation (List Property)' },
                  { value: 'VIP Concierge Booking', label: 'VIP Concierge Booking' },
                ]}
              />
            </div>

            {/* Message */}
            <FormField
              id="message"
              label="Message / Inquiry Details"
              fieldType="textarea"
              placeholder="Describe your destination preferences, dates, or partnership proposal details..."
              error={errors.message}
              registerProps={register('message')}
            />

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 rounded-full flex items-center justify-center gap-2 text-xs font-bold text-white uppercase"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send VIP Inquiry</span>
            </Button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Message Dispatched"
        size="sm"
      >
        {formData && (
          <div className="text-center py-4 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-500 mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-obsidian-900 mb-2">
              Message Dispatched
            </h3>
            <p className="text-xs text-obsidian-600 mb-6 max-w-xs">
              Thank you, <span className="font-semibold text-gold-600">{formData.name}</span>. Your
              inquiry regarding <span className="italic">{formData.subject}</span> has been
              received. Our concierge staff is preparing a detailed proposal.
            </p>
            <Button
              onClick={() => setSuccessModalOpen(false)}
              variant="primary"
              className="px-6 py-2 rounded-full text-xs font-bold"
            >
              Acknowledge
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default Contact;
