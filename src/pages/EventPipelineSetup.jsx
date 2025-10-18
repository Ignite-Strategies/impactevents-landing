import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";

export default function EventPipelineSetup() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [selectedAudiences, setSelectedAudiences] = useState([]);
  const [loading, setLoading] = useState(false);

  // 5 Pipeline Audience Types
  const AUDIENCE_OPTIONS = [
    {
      id: 'org_members',
      name: 'Org Members',
      description: 'Internal team and existing contacts',
      icon: '👥',
      stages: ['in_funnel', 'general_awareness', 'personal_invite', 'expressed_interest', 'soft_commit', 'paid', 'cant_attend']
    },
    {
      id: 'friends_family',
      name: 'Friends & Family',
      description: 'Personal network and close contacts',
      icon: '👨‍👩‍👧‍👦',
      stages: ['in_funnel', 'personal_invite', 'soft_commit', 'paid', 'cant_attend']
    },
    {
      id: 'landing_page_public',
      name: 'Landing Page Public',
      description: 'Public visitors from your website',
      icon: '🌐',
      stages: ['in_funnel', 'soft_commit', 'paid', 'cant_attend']
    },
    {
      id: 'community_partners',
      name: 'Community Partners',
      description: 'Local businesses and organizations',
      icon: '🤝',
      stages: ['in_funnel', 'general_awareness', 'personal_invite', 'expressed_interest', 'soft_commit', 'paid', 'cant_attend']
    },
    {
      id: 'cold_outreach',
      name: 'Cold Outreach',
      description: 'New contacts and prospects',
      icon: '📞',
      stages: ['in_funnel', 'general_awareness', 'general_awareness', 'personal_invite', 'expressed_interest', 'soft_commit', 'paid', 'cant_attend']
    }
  ];

  const handleAudienceToggle = (audienceId) => {
    setSelectedAudiences(prev => 
      prev.includes(audienceId) 
        ? prev.filter(id => id !== audienceId)
        : [...prev, audienceId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create pipelines for each selected audience
      for (const audienceId of selectedAudiences) {
        await api.post(`/events/${eventId}/pipelines`, {
          audienceType: audienceId,
          stages: AUDIENCE_OPTIONS.find(a => a.id === audienceId).stages
        });
      }

      navigate(`/event/${eventId}/pipelines`);
    } catch (error) {
      console.error('Pipeline setup error:', error);
      alert('Error setting up pipelines: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🎉 Congrats on setting up your event!
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Let's get your pipelines set up so you can track your attendees!
            </p>
            <p className="text-gray-500">
              What target audiences do you think you'll hit?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AUDIENCE_OPTIONS.map((audience) => (
                <div
                  key={audience.id}
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    selectedAudiences.includes(audience.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleAudienceToggle(audience.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        {audience.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedAudiences.includes(audience.id)}
                          onChange={() => handleAudienceToggle(audience.id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {audience.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 mt-2">
                        {audience.description}
                      </p>
                      <div className="mt-3">
                        <p className="text-sm text-gray-500 mb-2">Pipeline stages:</p>
                        <div className="flex flex-wrap gap-1">
                          {audience.stages.map((stage, index) => (
                            <span
                              key={stage}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {stage.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedAudiences.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  ✅ Selected Audiences ({selectedAudiences.length})
                </h3>
                <p className="text-green-700">
                  We'll create {selectedAudiences.length} pipeline{selectedAudiences.length > 1 ? 's' : ''} for your event.
                </p>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => navigate(`/event/${eventId}`)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                ← Back to Event
              </button>
              
              <button
                type="submit"
                disabled={selectedAudiences.length === 0 || loading}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Setting up pipelines...' : 'Set Up Pipelines →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
