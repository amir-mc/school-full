// src/components/messages/ContactList.tsx
'use client';

interface ContactListProps {
  selectedContact: string | null;
  onSelect: (contactId: string) => void;
}

const mockContacts = [
  { id: '1', name: 'والدین علی محمدی', role: 'PARENT' },
  { id: '2', name: 'والدین زهرا اکبری', role: 'PARENT' },
  { id: '3', name: 'مدیر مدرسه', role: 'ADMIN' },
];

export default function ContactList({ selectedContact, onSelect }: ContactListProps) {
  return (
    <div className="border rounded-lg p-2">
      <h3 className="font-bold mb-2">مخاطبین</h3>
      <ul className="space-y-2">
        {mockContacts.map(contact => (
          <li
            key={contact.id}
            onClick={() => onSelect(contact.id)}
            className={`p-2 rounded cursor-pointer ${
              selectedContact === contact.id ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
          >
            {contact.name}
          </li>
        ))}
      </ul>
    </div>
  );
}