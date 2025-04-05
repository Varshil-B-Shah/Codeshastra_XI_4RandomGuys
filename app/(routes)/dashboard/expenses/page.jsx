"use client";
import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';

export default function ExpensesPage() {
  return (
    <DashboardLayout title="Expense Tracker">
      <h2 className="text-2xl font-bold mb-6">Track Your Expenses</h2>
      <p className="mb-6">Manage your travel budget effectively</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-100 p-6 rounded-xl shadow-md text-green-800">
          <h3 className="text-lg font-semibold">Total Budget</h3>
          <p className="text-3xl font-bold mt-2">₹50,000</p>
        </div>
        <div className="bg-blue-100 p-6 rounded-xl shadow-md text-blue-800">
          <h3 className="text-lg font-semibold">Expenses So Far</h3>
          <p className="text-3xl font-bold mt-2">₹23,450</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-xl shadow-md text-purple-800">
          <h3 className="text-lg font-semibold">Remaining</h3>
          <p className="text-3xl font-bold mt-2">₹26,550</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Recent Expenses</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Add Expense
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { date: '2023-07-15', category: 'Accommodation', description: 'Hotel Taj Palace', amount: '₹12,500' },
                { date: '2023-07-14', category: 'Transportation', description: 'Flight to Delhi', amount: '₹6,800' },
                { date: '2023-07-14', category: 'Food', description: 'Dinner at local restaurant', amount: '₹1,450' },
                { date: '2023-07-13', category: 'Activities', description: 'Guided tour', amount: '₹2,200' },
                { date: '2023-07-12', category: 'Shopping', description: 'Souvenirs', amount: '₹500' },
              ].map((expense, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                  <td className="px-6 py-4">{expense.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">{expense.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Expense Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Accommodation</span>
              <span className="font-medium">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Transportation</span>
              <span className="font-medium">25%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Food</span>
              <span className="font-medium">15%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: '15%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Activities</span>
              <span className="font-medium">10%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '10%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Shopping</span>
              <span className="font-medium">5%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '5%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Shared Expenses</h3>
          <div className="space-y-4">
            {[
              { name: 'Rahul', amount: '₹4,500', status: 'Paid' },
              { name: 'Priya', amount: '₹3,200', status: 'Pending' },
              { name: 'Amit', amount: '₹5,100', status: 'Paid' },
              { name: 'Sneha', amount: '₹2,800', status: 'Pending' },
            ].map((person, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{person.name}</p>
                  <p className="text-sm text-gray-500">Owes you {person.amount}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  person.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {person.status}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full">
            Send Reminders
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
