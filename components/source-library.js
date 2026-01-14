/**
 * Source Library
 * Collection of data sources for consumer insights analysts
 * 
 * Each source can have:
 * - icon: Material Symbol icon name (preferred)
 * - image: URL to an image/logo (for branded sources)
 * - color: Brand color for the tag
 * - label: Display name
 */

const SourceLibrary = {
  // ============================================
  // Document Types
  // ============================================
  pdf: {
    id: 'pdf',
    label: 'PDF',
    icon: 'picture_as_pdf',
    color: '#E53935',
    category: 'document'
  },
  pptx: {
    id: 'pptx',
    label: 'PowerPoint',
    icon: 'slideshow',
    color: '#D14424',
    category: 'document'
  },
  excel: {
    id: 'excel',
    label: 'Excel',
    icon: 'table_chart',
    color: '#217346',
    category: 'document'
  },
  word: {
    id: 'word',
    label: 'Word',
    icon: 'article',
    color: '#2B579A',
    category: 'document'
  },
  csv: {
    id: 'csv',
    label: 'CSV',
    icon: 'table_rows',
    color: '#666560',
    category: 'document'
  },
  json: {
    id: 'json',
    label: 'JSON',
    icon: 'data_object',
    color: '#F7DF1E',
    category: 'document'
  },

  // ============================================
  // Cloud & Database Platforms
  // ============================================
  snowflake: {
    id: 'snowflake',
    label: 'Snowflake',
    icon: 'ac_unit',
    color: '#29B5E8',
    category: 'platform'
  },
  bigquery: {
    id: 'bigquery',
    label: 'BigQuery',
    icon: 'hub',
    color: '#4285F4',
    category: 'platform'
  },
  redshift: {
    id: 'redshift',
    label: 'Redshift',
    icon: 'database',
    color: '#8C4FFF',
    category: 'platform'
  },
  databricks: {
    id: 'databricks',
    label: 'Databricks',
    icon: 'spark',
    color: '#FF3621',
    category: 'platform'
  },

  // ============================================
  // Research & Insights Platforms
  // ============================================
  mintel: {
    id: 'mintel',
    label: 'Mintel',
    icon: 'insights',
    color: '#E31837',
    category: 'research'
  },
  kantar: {
    id: 'kantar',
    label: 'Kantar',
    icon: 'analytics',
    color: '#00A9E0',
    category: 'research'
  },
  nielsen: {
    id: 'nielsen',
    label: 'Nielsen',
    icon: 'monitoring',
    color: '#00A8E1',
    category: 'research'
  },
  euromonitor: {
    id: 'euromonitor',
    label: 'Euromonitor',
    icon: 'public',
    color: '#003366',
    category: 'research'
  },
  statista: {
    id: 'statista',
    label: 'Statista',
    icon: 'bar_chart',
    color: '#1A5276',
    category: 'research'
  },
  gartner: {
    id: 'gartner',
    label: 'Gartner',
    icon: 'corporate_fare',
    color: '#002856',
    category: 'research'
  },
  forrester: {
    id: 'forrester',
    label: 'Forrester',
    icon: 'trending_up',
    color: '#00A94F',
    category: 'research'
  },

  // ============================================
  // Analytics & BI Tools
  // ============================================
  tableau: {
    id: 'tableau',
    label: 'Tableau',
    icon: 'dashboard',
    color: '#E97627',
    category: 'analytics'
  },
  powerbi: {
    id: 'powerbi',
    label: 'Power BI',
    icon: 'speed',
    color: '#F2C811',
    category: 'analytics'
  },
  looker: {
    id: 'looker',
    label: 'Looker',
    icon: 'visibility',
    color: '#4285F4',
    category: 'analytics'
  },
  googleanalytics: {
    id: 'googleanalytics',
    label: 'Google Analytics',
    icon: 'query_stats',
    color: '#E37400',
    category: 'analytics'
  },

  // ============================================
  // Survey & Feedback Tools
  // ============================================
  qualtrics: {
    id: 'qualtrics',
    label: 'Qualtrics',
    icon: 'quiz',
    color: '#00B4E5',
    category: 'survey'
  },
  surveymonkey: {
    id: 'surveymonkey',
    label: 'SurveyMonkey',
    icon: 'assignment',
    color: '#00BF6F',
    category: 'survey'
  },
  typeform: {
    id: 'typeform',
    label: 'Typeform',
    icon: 'edit_note',
    color: '#262627',
    category: 'survey'
  },

  // ============================================
  // Social & Digital Platforms
  // ============================================
  meta: {
    id: 'meta',
    label: 'Meta',
    icon: 'groups',
    color: '#0081FB',
    category: 'social'
  },
  tiktok: {
    id: 'tiktok',
    label: 'TikTok',
    icon: 'music_note',
    color: '#000000',
    category: 'social'
  },
  twitter: {
    id: 'twitter',
    label: 'X/Twitter',
    icon: 'tag',
    color: '#000000',
    category: 'social'
  },
  instagram: {
    id: 'instagram',
    label: 'Instagram',
    icon: 'photo_camera',
    color: '#E4405F',
    category: 'social'
  },
  linkedin: {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: 'work',
    color: '#0A66C2',
    category: 'social'
  },

  // ============================================
  // CRM & Enterprise
  // ============================================
  salesforce: {
    id: 'salesforce',
    label: 'Salesforce',
    icon: 'cloud',
    color: '#00A1E0',
    category: 'enterprise'
  },
  hubspot: {
    id: 'hubspot',
    label: 'HubSpot',
    icon: 'hub',
    color: '#FF7A59',
    category: 'enterprise'
  },
  sap: {
    id: 'sap',
    label: 'SAP',
    icon: 'account_tree',
    color: '#0FAAFF',
    category: 'enterprise'
  },

  // ============================================
  // Spreadsheet & Collaboration
  // ============================================
  googlesheets: {
    id: 'googlesheets',
    label: 'Google Sheets',
    icon: 'grid_on',
    color: '#0F9D58',
    category: 'document'
  },
  airtable: {
    id: 'airtable',
    label: 'Airtable',
    icon: 'table_view',
    color: '#18BFFF',
    category: 'document'
  },
  notion: {
    id: 'notion',
    label: 'Notion',
    icon: 'edit_document',
    color: '#000000',
    category: 'document'
  }
};

// Helper functions
SourceLibrary.get = function(id) {
  return this[id.toLowerCase()] || null;
};

SourceLibrary.getByCategory = function(category) {
  return Object.values(this).filter(s => s.category === category && typeof s === 'object');
};

SourceLibrary.getAllSources = function() {
  return Object.values(this).filter(s => typeof s === 'object' && s.id);
};

SourceLibrary.getCategories = function() {
  const sources = this.getAllSources();
  return [...new Set(sources.map(s => s.category))];
};

// Expose globally
window.SourceLibrary = SourceLibrary;


