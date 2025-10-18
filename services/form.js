/**
 * Form Service - Dynamic form creation and field management
 * Users can add fields to mutate forms
 */

import { getPrismaClient } from '../config/database.js';

const prisma = getPrismaClient();

// Standard field types
export const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PHONE: 'phone',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  TEXTAREA: 'textarea',
  NUMBER: 'number',
  DATE: 'date'
};

/**
 * Create EventForm with dynamic fields
 */
export async function createEventForm(eventId, pipelineId, formData) {
  try {
    console.log(`📝 Creating EventForm: eventId=${eventId}, pipelineId=${pipelineId}`);
    
    const { name, slug, description, targetStage, fields, styling } = formData;
    
    // Get event to get orgId
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });
    
    if (!event) {
      return { success: false, error: 'Event not found' };
    }
    
    const form = await prisma.eventForm.create({
      data: {
        orgId: event.orgId,
        eventId,
        pipelineId,
        name,
        slug,
        description,
        targetStage,
        fields: fields || [], // Dynamic field definitions
        styling: styling || {},
        isActive: true
      }
    });
    
    console.log(`✅ EventForm created: ${form.id}`);
    return { success: true, form };
    
  } catch (error) {
    console.error('❌ Create EventForm error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Add field to existing form
 */
export async function addFormField(formId, fieldData) {
  try {
    console.log(`➕ Adding field to form: ${formId}`);
    
    const form = await prisma.eventForm.findUnique({
      where: { id: formId }
    });
    
    if (!form) {
      return { success: false, error: 'Form not found' };
    }
    
    // Get current fields
    const currentFields = form.fields || [];
    
    // Add new field
    const newField = {
      id: `field_${Date.now()}`, // Generate unique ID
      ...fieldData,
      createdAt: new Date().toISOString()
    };
    
    const updatedFields = [...currentFields, newField];
    
    // Update form with new fields
    const updatedForm = await prisma.eventForm.update({
      where: { id: formId },
      data: { fields: updatedFields }
    });
    
    console.log(`✅ Field added to form: ${newField.id}`);
    return { success: true, form: updatedForm, field: newField };
    
  } catch (error) {
    console.error('❌ Add form field error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update field in form
 */
export async function updateFormField(formId, fieldId, fieldData) {
  try {
    console.log(`✏️ Updating field: ${fieldId} in form: ${formId}`);
    
    const form = await prisma.eventForm.findUnique({
      where: { id: formId }
    });
    
    if (!form) {
      return { success: false, error: 'Form not found' };
    }
    
    // Get current fields
    const currentFields = form.fields || [];
    
    // Find and update field
    const updatedFields = currentFields.map(field => 
      field.id === fieldId 
        ? { ...field, ...fieldData, updatedAt: new Date().toISOString() }
        : field
    );
    
    // Update form
    const updatedForm = await prisma.eventForm.update({
      where: { id: formId },
      data: { fields: updatedFields }
    });
    
    console.log(`✅ Field updated: ${fieldId}`);
    return { success: true, form: updatedForm };
    
  } catch (error) {
    console.error('❌ Update form field error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Remove field from form
 */
export async function removeFormField(formId, fieldId) {
  try {
    console.log(`🗑️ Removing field: ${fieldId} from form: ${formId}`);
    
    const form = await prisma.eventForm.findUnique({
      where: { id: formId }
    });
    
    if (!form) {
      return { success: false, error: 'Form not found' };
    }
    
    // Get current fields
    const currentFields = form.fields || [];
    
    // Remove field
    const updatedFields = currentFields.filter(field => field.id !== fieldId);
    
    // Update form
    const updatedForm = await prisma.eventForm.update({
      where: { id: formId },
      data: { fields: updatedFields }
    });
    
    console.log(`✅ Field removed: ${fieldId}`);
    return { success: true, form: updatedForm };
    
  } catch (error) {
    console.error('❌ Remove form field error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get form with fields
 */
export async function getFormWithFields(formId) {
  try {
    const form = await prisma.eventForm.findUnique({
      where: { id: formId },
      include: {
        pipeline: {
          select: {
            audienceType: true,
            stages: true
          }
        }
      }
    });
    
    if (!form) {
      return { success: false, error: 'Form not found' };
    }
    
    return { success: true, form };
    
  } catch (error) {
    console.error('❌ Get form error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all forms for an event
 */
export async function getEventForms(eventId) {
  try {
    const forms = await prisma.eventForm.findMany({
      where: { eventId },
      include: {
        pipeline: {
          select: {
            audienceType: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return { success: true, forms };
    
  } catch (error) {
    console.error('❌ Get event forms error:', error);
    return { success: false, error: error.message };
  }
}
