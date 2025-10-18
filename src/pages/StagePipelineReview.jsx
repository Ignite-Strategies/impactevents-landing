import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function StagePipelineReview() {
  const { eventId, audienceType } = useParams();
  const navigate = useNavigate();
  const [pipeline, setPipeline] = useState(null);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Default stage options
  const AVAILABLE_STAGES = [
    { id: 'in_funnel', name: 'In Funnel', description: 'Just entered the pipeline' },
    { id: 'general_awareness', name: 'General Awareness', description: 'Knows about the event' },
    { id: 'personal_invite', name: 'Personal Invite', description: 'Received personal invitation' },
    { id: 'expressed_interest', name: 'Expressed Interest', description: 'Showed interest in attending' },
    { id: 'soft_commit', name: 'Soft Commit', description: 'Committed to attend (not paid)' },
    { id: 'paid', name: 'Paid', description: 'Purchased ticket/paid' },
    { id: 'cant_attend', name: "Can't Attend", description: 'Opted out or declined' }
  ];

  useEffect(() => {
    loadPipeline();
  }, [eventId, audienceType]);

  const loadPipeline = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${eventId}/pipelines/${audienceType}`);
      setPipeline(response.data);
      setStages(response.data.stages || []);
    } catch (error) {
      console.error('Error loading pipeline:', error);
      alert('Error loading pipeline: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStageToggle = (stageId) => {
    setStages(prev => 
      prev.includes(stageId) 
        ? prev.filter(id => id !== stageId)
        : [...prev, stageId]
    );
  };

  const handleStageReorder = (fromIndex, toIndex) => {
    const newStages = [...stages];
    const [movedStage] = newStages.splice(fromIndex, 1);
    newStages.splice(toIndex, 0, movedStage);
    setStages(newStages);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.patch(`/events/${eventId}/pipelines/${audienceType}`, {
        stages: stages
      });
      alert('Pipeline stages updated successfully!');
      navigate(`/event/${eventId}/pipelines`);
    } catch (error) {
      console.error('Error saving pipeline:', error);
      alert('Error saving pipeline: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const getStageInfo = (stageId) => {
    return AVAILABLE_STAGES.find(s => s.id === stageId) || { name: stageId, description: '' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🔄 Pipeline Stage Review
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Review and customize your pipeline stages for <strong>{audienceType.replace('_', ' ')}</strong>
            </p>
            <p className="text-gray-500">
              Drag to reorder, check/uncheck to include/exclude stages
            </p>
          </div>

          <div className="space-y-6">
            {/* Current Pipeline Stages */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Current Pipeline Stages ({stages.length})
              </h3>
              
              {stages.length === 0 ? (
                <p className="text-gray-500 italic">No stages selected</p>
              ) : (
                <div className="space-y-3">
                  {stages.map((stageId, index) => {
                    const stageInfo = getStageInfo(stageId);
                    return (
                      <div
                        key={stageId}
                        className="flex items-center space-x-4 bg-white rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{stageInfo.name}</h4>
                          <p className="text-sm text-gray-600">{stageInfo.description}</p>
                        </div>
                        <button
                          onClick={() => handleStageToggle(stageId)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Available Stages */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Available Stages
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {AVAILABLE_STAGES.map((stage) => (
                  <div
                    key={stage.id}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                      stages.includes(stage.id)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={stages.includes(stage.id)}
                      onChange={() => handleStageToggle(stage.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{stage.name}</h4>
                      <p className="text-sm text-gray-600">{stage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-6">
              <button
                onClick={() => navigate(`/event/${eventId}/pipelines`)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                ← Back to Pipelines
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving || stages.length === 0}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Pipeline Stages →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
