import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PRIVACY_POLICY = `**PRIVACY POLICY**

Last Updated: 30 September 2026

Barakah respects your privacy and is committed to keeping your personal information safe. This Privacy Policy explains how we collect, use and protect information when you visit our website, place an order or contact us.

By using our website, barakahstz.com, you agree to the practices described in this Privacy Policy.

---

### 1. INFORMATION WE COLLECT

When you place an order with Barakah, we collect the information needed to process and deliver your order.

This may include:

- Your name
- Mobile phone number
- Division
- City or district
- Delivery address
- Products selected
- Quantity ordered
- Order total
- Information you provide when contacting us about an order

We may also collect basic technical information when you visit our website, such as your IP address, browser type, device information, pages you visit and general information about how you use the website.

---

### 2. HOW WE USE YOUR INFORMATION

We use your information mainly to process your order and provide customer support.

Your information may be used to:

- Confirm and process your order
- Contact you regarding your order
- Arrange delivery
- Confirm your delivery details
- Respond to your questions
- Handle returns, refunds or order-related issues
- Provide customer support
- Improve our website and services
- Prevent fraudulent or unauthorised activity
- Maintain necessary business records

We may contact you by phone or WhatsApp when necessary to confirm your order, clarify delivery information or resolve an issue with your order.

---

### 3. ORDER AND DELIVERY INFORMATION

The information you provide during checkout is used to complete your order.

Your name, mobile number and delivery address may be provided to the person or delivery service handling your order so that your package can be delivered correctly.

We only use and share the information needed to complete the delivery and provide the related service.

---

### 4. CASH ON DELIVERY

Barakah currently accepts Cash on Delivery for orders placed through the website.

Our order form does not ask customers to provide banking passwords, card PINs or other confidential banking credentials.

If additional payment methods are introduced in the future, the relevant payment information will be handled through the applicable payment service.

---

### 5. COOKIES AND WEBSITE INFORMATION

Our website may use cookies and similar technologies to help the website function properly and to understand how visitors use our website.

These technologies may be used to:

- Keep the website functioning properly
- Remember certain website activity
- Understand website traffic
- Improve website performance
- Identify technical problems
- Measure the performance of our marketing activities

You can manage or disable cookies through your browser settings. Some parts of the website may not work properly if certain cookies are disabled.

---

### 6. MARKETING AND ADVERTISING

We may use website and advertising technologies to understand how visitors interact with our website and to measure the performance of our marketing.

These technologies may include cookies, pixels, tags or similar tools.

We do not ask customers to provide banking passwords, card PINs or similar confidential banking information through these technologies.

---

### 7. SHARING YOUR INFORMATION

Barakah does not sell your personal information.

We may share necessary information with trusted parties when it is required to operate our website, process an order or provide a service.

This may include:

- Delivery personnel or delivery service providers
- Website hosting and technical service providers
- Customer support or communication service providers
- Website analytics or advertising service providers
- Government authorities when disclosure is required by law

We only provide information that is reasonably necessary for the relevant purpose.

---

### 8. PROTECTION OF YOUR INFORMATION

We take reasonable steps to protect your personal information from unauthorised access, misuse, loss, alteration or disclosure.

However, no website or internet transmission can be guaranteed to be completely secure.

For your own safety, please do not send passwords, banking PINs or other highly confidential information through our website, WhatsApp or customer support channels.

---

### 9. HOW LONG WE KEEP YOUR INFORMATION

We keep customer and order information for as long as reasonably necessary to:

- Complete and manage orders
- Provide customer support
- Handle returns and refunds
- Maintain business and transaction records
- Resolve disputes
- Meet applicable legal requirements

When information is no longer reasonably required, we may delete or securely dispose of it, subject to any legal or legitimate business requirement to retain it.

---

### 10. YOUR INFORMATION AND YOUR REQUESTS

If you believe that the personal information we have about you is incorrect or incomplete, you may contact us and request that it be corrected.

You may also contact us if you have questions about how your personal information is collected or used.

For security purposes, we may need to verify your identity before making changes to or providing information about an order.

---

### 11. THIRD-PARTY WEBSITES

Our website may contain links to third-party websites, services or social media platforms.

These websites have their own privacy policies and terms. Barakah is not responsible for the privacy practices or security of websites that we do not operate.

---

### 12. CHILDREN'S INFORMATION

Our website is not intended to knowingly collect personal information from children for independent purchases.

If we become aware that personal information has been submitted by a child in circumstances where it should not have been collected, we will take reasonable steps to address the matter.

---

### 13. CHANGES TO THIS PRIVACY POLICY

We may update this Privacy Policy from time to time if our website, services, technology or information-handling practices change.

Any updated version will be published on this page with a new "Last Updated" date.

---

### 14. CONTACT US

If you have any questions about this Privacy Policy or how your information is handled, please contact us.

**Barakah**
Phone: +8801353366144
Email: support@barakah.com
Location: Bhaluka, Bangladesh

For questions related to a specific order, please provide your name and relevant order information so that we can assist you.

---

### 15. APPLICABLE LAW

This Privacy Policy is intended to be applied in accordance with the laws and applicable requirements of Bangladesh.

---

### 16. ACCEPTANCE

By using our website or placing an order, you acknowledge that you have read and understood this Privacy Policy.

If you do not agree with this Privacy Policy, please do not use the website or submit personal information through it.

---

© 2026 Barakah. All rights reserved.`;

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        হোমে ফিরে যান
      </Link>

      <div className="prose prose-zinc max-w-none prose-headings:font-bold prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-4 prose-p:text-[15px] prose-p:leading-relaxed prose-li:text-[15px] prose-hr:my-6">
        {PRIVACY_POLICY.split('\n').map((line, i) => {
          if (line.startsWith('**') && line.endsWith('**')) {
            const text = line.slice(2, -2);
            return <h1 key={i} className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{text}</h1>;
          }
          if (line.startsWith('### ')) {
            return <h3 key={i}>{line.slice(4)}</h3>;
          }
          if (line === '---') {
            return <hr key={i} />;
          }
          if (line.startsWith('- ')) {
            return (
              <div key={i} className="flex items-start gap-2 ml-4 my-1">
                <span className="text-zinc-400 mt-1">•</span>
                <span className="text-[15px] text-zinc-600">{line.slice(2)}</span>
              </div>
            );
          }
          if (line.trim() === '') {
            return <div key={i} className="h-2" />;
          }
          // Handle bold text within lines
          const parts = line.split(/(\*\*[^*]+\*\*)/g);
          return (
            <p key={i} className="text-zinc-600 my-1">
              {parts.map((part, j) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={j} className="text-zinc-900">{part.slice(2, -2)}</strong>;
                }
                return <span key={j}>{part}</span>;
              })}
            </p>
          );
        })}
      </div>
    </div>
  );
}
