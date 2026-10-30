import React, { useState } from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Alert } from '../../components/common/Alert';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Mail, Phone, MapPin, MessageSquare, Clock, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'CUSTOMER_SUPPORT',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Help & Support</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">How Can We Help You?</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Have questions regarding orders, pharmacy onboarding, or delivery partnerships? Our support team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Details Column */}
          <div className="space-y-4">
            <Card className="bg-white">
              <CardContent className="pt-6 space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-brand-700 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Customer Helpline</h4>
                    <p className="text-slate-500">+91 1800 200 4567 (Mon-Sat, 9AM-8PM IST)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-brand-700 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Email Support</h4>
                    <p className="text-slate-500">support@pharmora.in</p>
                    <p className="text-slate-500">compliance@pharmora.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-700 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Operations Hub</h4>
                    <p className="text-slate-500">PHARMORA Technologies Pvt. Ltd.</p>
                    <p className="text-slate-500">Bengaluru, Karnataka - 560001</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-brand-700 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Response SLA</h4>
                    <p className="text-slate-500">Order issues: Within 15 minutes</p>
                    <p className="text-slate-500">Pharmacy verification: 24 business hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert variant="info" title="Emergency Notice">
              PHARMORA is not an emergency medical service. If a patient is experiencing severe chest pain, breathing difficulties, or acute trauma, please dial <strong>112 / 108</strong> immediately.
            </Alert>
          </div>

          {/* Contact Form Column */}
          <div className="md:col-span-2">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Submit a Request</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <Send className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Inquiry Submitted Successfully</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Thank you for contacting PHARMORA Support. A ticket reference has been logged. Our representative will contact you within our standard response window.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                      Submit Another Query
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Mobile Number"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                      <div className="space-y-1.5 text-left">
                        <label className="block text-sm font-medium text-slate-700">Inquiry Type</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                        >
                          <option value="CUSTOMER_SUPPORT">Customer Medicine Order Issue</option>
                          <option value="PHARMACY_PARTNER">Pharmacy Partner Onboarding</option>
                          <option value="DELIVERY_PARTNER">Delivery Partner Inquiries</option>
                          <option value="COMPLIANCE">Statutory & Regulatory Inquiry</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-sm font-medium text-slate-700">Your Message</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Describe your inquiry or order details..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="flex w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                      />
                    </div>

                    <Button type="submit" variant="primary" className="w-full sm:w-auto">
                      Send Support Request
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
