'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiCheck, 
  FiClock, 
  FiUser,
  FiMapPin,
  FiCalendar,
  FiFilter,
  FiSearch
} from 'react-icons/fi';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useAdminAuth } from '../../../components/admin/AdminAuthProvider';

const TaskManagement = () => {
  const { user, hasPermission } = useAdminAuth();
  const [tasks, setTasks] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with API calls
  useEffect(() => {
    setTasks([
      {
        id: 1,
        title: 'Food Distribution Drive',
        description: 'Distribute food packages to homeless shelter residents',
        category: 'Community Service',
        location: 'Downtown Shelter',
        address: '123 Main St, City Center',
        urgency: 'high',
        skillsRequired: ['Communication', 'Physical Work'],
        timeCommitment: '4 hours',
        maxVolunteers: 5,
        assignedVolunteers: 3,
        status: 'active',
        dueDate: '2024-07-25',
        createdAt: '2024-07-18',
        assignedTo: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
          { id: 3, name: 'Mike Johnson', email: 'mike@example.com' }
        ]
      },
      {
        id: 2,
        title: 'Medical Equipment Setup',
        description: 'Help setup medical equipment for health camp',
        category: 'Healthcare',
        location: 'Community Health Center',
        address: '456 Health Ave, Medical District',
        urgency: 'medium',
        skillsRequired: ['Technical Skills', 'Healthcare Background'],
        timeCommitment: '6 hours',
        maxVolunteers: 3,
        assignedVolunteers: 1,
        status: 'pending',
        dueDate: '2024-07-30',
        createdAt: '2024-07-17',
        assignedTo: [
          { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com' }
        ]
      }
    ]);

    setVolunteers([
      { id: 1, name: 'John Doe', email: 'john@example.com', skills: ['Communication', 'Physical Work'] },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', skills: ['Healthcare Background', 'Technical Skills'] },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', skills: ['Communication', 'Event Management'] },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', skills: ['Technical Skills', 'Healthcare Background'] },
      { id: 5, name: 'David Brown', email: 'david@example.com', skills: ['Physical Work', 'Transportation'] }
    ]);

    setLoading(false);
  }, []);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    address: '',
    urgency: 'medium',
    skillsRequired: [],
    timeCommitment: '',
    maxVolunteers: 1,
    dueDate: '',
    assignedTo: []
  });

  const handleCreateTask = async (e) => {
    e.preventDefault();
    // Here you would make an API call to create the task
    const task = {
      ...newTask,
      id: Date.now(),
      status: 'pending',
      assignedVolunteers: newTask.assignedTo.length,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setTasks([...tasks, task]);
    setShowCreateModal(false);
    setNewTask({
      title: '',
      description: '',
      category: '',
      location: '',
      address: '',
      urgency: 'medium',
      skillsRequired: [],
      timeCommitment: '',
      maxVolunteers: 1,
      dueDate: '',
      assignedTo: []
    });
  };

  const handleAssignVolunteer = (taskId, volunteerId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const volunteer = volunteers.find(v => v.id === volunteerId);
        if (volunteer && !task.assignedTo.find(v => v.id === volunteerId)) {
          return {
            ...task,
            assignedTo: [...task.assignedTo, volunteer],
            assignedVolunteers: task.assignedVolunteers + 1
          };
        }
      }
      return task;
    }));
  };

  const handleUnassignVolunteer = (taskId, volunteerId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          assignedTo: task.assignedTo.filter(v => v.id !== volunteerId),
          assignedVolunteers: task.assignedVolunteers - 1
        };
      }
      return task;
    }));
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!hasPermission('task_management')) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access task management.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-600 mt-2">Manage volunteer tasks and assignments</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FiPlus /> Create Task
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(task.urgency)}`}>
                        {task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)} Priority
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{task.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMapPin size={14} />
                    <span>{task.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCalendar size={14} />
                    <span>Due: {task.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiClock size={14} />
                    <span>{task.timeCommitment}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiUser size={14} />
                    <span>{task.assignedVolunteers}/{task.maxVolunteers} volunteers assigned</span>
                  </div>
                </div>

                {/* Skills Required */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Skills Required:</p>
                  <div className="flex flex-wrap gap-2">
                    {task.skillsRequired.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Assigned Volunteers */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Assigned Volunteers:</p>
                  <div className="space-y-1">
                    {task.assignedTo.map((volunteer) => (
                      <div key={volunteer.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">{volunteer.name}</span>
                        <button
                          onClick={() => handleUnassignVolunteer(task.id, volunteer.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {task.assignedVolunteers < task.maxVolunteers && (
                    <select
                      onChange={(e) => e.target.value && handleAssignVolunteer(task.id, parseInt(e.target.value))}
                      className="mt-2 w-full text-sm border border-gray-300 rounded px-2 py-1"
                      defaultValue=""
                    >
                      <option value="">Assign volunteer...</option>
                      {volunteers
                        .filter(volunteer => !task.assignedTo.find(assigned => assigned.id === volunteer.id))
                        .map((volunteer) => (
                          <option key={volunteer.id} value={volunteer.id}>
                            {volunteer.name} - {volunteer.skills.join(', ')}
                          </option>
                        ))}
                    </select>
                  )}
                </div>

                {/* Status Actions */}
                <div className="flex gap-2">
                  {task.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(task.id, 'active')}
                      className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 flex items-center justify-center gap-1"
                    >
                      <FiCheck size={14} /> Activate
                    </button>
                  )}
                  {task.status === 'active' && (
                    <button
                      onClick={() => handleStatusChange(task.id, 'completed')}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
                    >
                      <FiCheck size={14} /> Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleStatusChange(task.id, 'cancelled')}
                    className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Task Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Create New Task</h2>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      required
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select category</option>
                      <option value="Community Service">Community Service</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Environment">Environment</option>
                      <option value="Emergency Response">Emergency Response</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                    <select
                      value={newTask.urgency}
                      onChange={(e) => setNewTask({ ...newTask, urgency: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={newTask.location}
                      onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Commitment</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 4 hours"
                      value={newTask.timeCommitment}
                      onChange={(e) => setNewTask({ ...newTask, timeCommitment: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    required
                    value={newTask.address}
                    onChange={(e) => setNewTask({ ...newTask, address: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Volunteers</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newTask.maxVolunteers}
                      onChange={(e) => setNewTask({ ...newTask, maxVolunteers: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      required
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  >
                    Create Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TaskManagement;
