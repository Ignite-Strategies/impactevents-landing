/**
 * OrgMember Service - Master contact list management
 * Handles OrgMember CRUD operations and relationships
 */

import { getPrismaClient } from '../config/database.js';

const prisma = getPrismaClient();

/**
 * Find or Create OrgMember by Firebase ID
 * Used during sign-in/sign-up flow
 */
export async function findOrCreateOrgMember(firebaseId, email, firstName, lastName, photoURL) {
  try {
    console.log('🔍 FindOrCreate OrgMember for firebaseId:', firebaseId);
    
    // Find existing OrgMember by firebaseId
    let orgMember = await prisma.orgMember.findUnique({
      where: { firebaseId }
    });
    
    if (orgMember) {
      console.log('✅ Existing OrgMember found:', orgMember.email);
      return { success: true, orgMember };
    }
    
    // Create new OrgMember (minimal fields, rest are null)
    console.log('📝 Creating new OrgMember for:', email);
    orgMember = await prisma.orgMember.create({
      data: {
        firebaseId,
        email: email || '',
        firstName: firstName || '',
        lastName: lastName || '',
        photoURL: photoURL || null,
        role: null, // No role until they create/join org
        orgId: null, // Will be set when they create/join org
        // All other fields default to null
        goesBy: null,
        phone: null,
        street: null,
        city: null,
        state: null,
        zip: null,
        employer: null,
        yearsWithOrganization: null,
        birthday: null,
        married: false,
        spouseName: null,
        numberOfKids: 0,
        originStory: null,
        notes: null
      }
    });
    
    console.log('✅ New OrgMember created:', orgMember.id);
    return { success: true, orgMember };
    
  } catch (error) {
    console.error('❌ FindOrCreate error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get OrgMember by ID
 */
export async function getOrgMember(orgMemberId) {
  try {
    const orgMember = await prisma.orgMember.findUnique({
      where: { id: orgMemberId },
      include: {
        org: {
          select: {
            name: true,
            slug: true
          }
        },
        attendees: {
          include: {
            event: {
              select: {
                name: true,
                slug: true
              }
            },
            pipeline: {
              select: {
                audienceType: true
              }
            }
          }
        }
      }
    });
    
    if (!orgMember) {
      return { success: false, error: 'OrgMember not found' };
    }
    
    return { success: true, orgMember };
    
  } catch (error) {
    console.error('❌ Get OrgMember error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get OrgMember by Firebase ID
 */
export async function getOrgMemberByFirebase(firebaseId) {
  try {
    const orgMember = await prisma.orgMember.findUnique({
      where: { firebaseId },
      include: {
        org: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });
    
    if (!orgMember) {
      return { success: false, error: 'OrgMember not found' };
    }
    
    return { success: true, orgMember };
    
  } catch (error) {
    console.error('❌ Get OrgMember by Firebase error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update OrgMember (for profile setup)
 */
export async function updateOrgMember(orgMemberId, updateData) {
  try {
    console.log('📝 Updating OrgMember:', orgMemberId);
    console.log('📝 Update data:', updateData);
    
    const orgMember = await prisma.orgMember.update({
      where: { id: orgMemberId },
      data: updateData
    });
    
    console.log('✅ OrgMember updated:', orgMember.email);
    return { success: true, orgMember };
    
  } catch (error) {
    console.error('❌ Update OrgMember error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all OrgMembers for an organization
 */
export async function getOrgMembers(orgId) {
  try {
    const orgMembers = await prisma.orgMember.findMany({
      where: { orgId },
      include: {
        attendees: {
          include: {
            event: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return { success: true, orgMembers };
    
  } catch (error) {
    console.error('❌ Get OrgMembers error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create OrgMember from contact data
 */
export async function createOrgMemberFromContact(contactData, orgId) {
  try {
    const { name, email, phone } = contactData;
    
    // Parse name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const orgMember = await prisma.orgMember.create({
      data: {
        orgId,
        firstName,
        lastName,
        email: email.toLowerCase().trim(),
        phone: phone || null,
        role: null,
        firebaseId: null,
        categoryOfEngagement: 'medium',
        tags: []
      }
    });
    
    return { success: true, orgMember };
    
  } catch (error) {
    console.error('❌ Create OrgMember from contact error:', error);
    return { success: false, error: error.message };
  }
}