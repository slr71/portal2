/**
 * Sequelize Models and Assocations
 * 
 * Model files were automaticallly generated using sequelize-auto.  
 * Customizations are made here.
 * 
 */

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const config = require('../config.json');


/**
 * Connect to database
 */

const sequelize = new Sequelize(
  config.db.database, config.db.user, config.db.password,
  { host: config.db.host,
    dialect: 'postgres',
    //logging: false,
    define: {
      timestamps: false,
      freezeTableName: true,
      underscored: true
     }
//    pool: {
//      max: dbConfig.pool.max,
//      min: dbConfig.pool.min,
//      acquire: dbConfig.pool.acquire,
//      idle: dbConfig.pool.idle
//    }
  });


/**
 * Load models
 */

let modelPath = path.resolve(process.cwd(), 'src/models'); // __dirname not working in Next.js
let models = {};
fs.readdirSync(modelPath) 
  .filter(file => file.split(".").pop() === 'js' && file !== "index.js")
  .forEach(file => {
    const model = require(path.join(modelPath, file))(sequelize, Sequelize.DataTypes); 
    models[model.name] = model;
  });


/**
 * Define associations
 */

models.account_user.belongsTo(models.account_ethnicity, { as: 'ethnicity' });
models.account_user.belongsTo(models.account_fundingagency, { as: 'funding_agency' });
models.account_user.belongsTo(models.account_gender, { as: 'gender' });
models.account_user.belongsTo(models.account_occupation, { as: 'occupation' });
models.account_user.belongsTo(models.account_region, { as: 'region' });
models.account_user.belongsTo(models.account_researcharea, { as: 'research_area' });
models.account_user.belongsTo(models.account_awarechannel, { as: 'aware_channel' });
models.account_user.hasMany(models.account_emailaddress, { as: 'emails', foreignKey: 'user_id' });
models.account_user.belongsToMany(models.api_service, 
  { as: 'services', through: models.request, foreignKey: 'user_id', otherKey: 'service_id' });
models.account_user.belongsToMany(models.api_workshop, 
  { as: 'workshops', through: models.api_userworkshop, foreignKey: 'user_id', otherKey: 'workshop_id' });

models.account_emailaddress.belongsToMany(models.api_mailinglist, 
  { as: 'mailing_lists', through: models.api_emailaddressmailinglist, foreignKey: 'email_address_id', otherKey: 'mailing_list_id' });
models.account_emailaddress.belongsTo(models.account_user, { as: 'user', foreignKey: 'user_id' });

models.account_region.belongsTo(models.account_country, {as: 'country' });

models.api_service.hasMany(models.api_poweredservice, { as: 'powered_services', foreignKey: 'service_ptr_id' });
models.api_service.hasMany(models.api_contact, { as: 'contacts', foreignKey: 'service_id' });
models.api_service.hasMany(models.api_serviceresource, { as: 'resources', foreignKey: 'service_id' });
models.api_service.belongsToMany(models.api_form, 
  { as: 'forms', through: models.api_serviceform, foreignKey: 'form_id', otherKey: 'service_id' });
models.api_service.belongsTo(models.api_servicemaintainer, { as: 'service_maintainer' });
// models.api_service.hasMany(models.api_accessrequest, { as: 'requests', foreignKey: 'service_id' });
models.api_service.hasMany(models.api_accessrequestquestion, { as: 'questions', foreignKey: 'service_id' });

models.api_accessrequestquestion.hasMany(models.api_accessrequestanswer, { as: 'answers', foreignKey: 'access_request_question_id' });

models.request.belongsTo(models.account_user, { as: 'user' });
models.request.belongsTo(models.api_service, { as: 'service' });
models.request.hasMany(models.api_accessrequestlog, { as: 'logs', foreignKey: 'access_request_id' });
models.request.hasOne(models.api_accessrequestconversation, { as: 'conversation', foreignKey: 'access_request_id' });

models.api_workshop.belongsTo(models.account_user, { as: 'owner', foreignKey: 'creator_id' });
models.api_workshop.hasMany(models.api_workshopuseremail, { as: 'emails', foreignKey: 'workshop_id' });
models.api_workshop.belongsToMany(models.api_service, 
  { as: 'services', through: models.api_workshopservice, foreignKey: 'workshop_id', otherKey: 'service_id' });
models.api_workshop.belongsToMany(models.account_user, 
  { as: 'users', through: models.api_userworkshop, foreignKey: 'workshop_id', otherKey: 'user_id' });
models.api_workshop.belongsToMany(models.account_user, 
  { as: 'organizers', through: models.api_workshoporganizer, foreignKey: 'workshop_id', otherKey: 'organizer_id' });
models.api_workshop.hasMany(models.api_workshopcontact, { as: 'contacts', foreignKey: 'workshop_id' });

models.api_formgroup.belongsToMany(models.api_form, 
  { as: 'forms', through: models.api_formgroupform, foreignKey: 'form_group_id', otherKey: 'form_id' });
models.api_form.hasMany(models.api_formsection, { as: 'sections', foreignKey: 'form_id' });
models.api_formsection.hasMany(models.api_formfield, { as: 'fields', foreignKey: 'form_section_id' });
models.api_formfield.hasMany(models.api_formfieldoption, { as: 'options', foreignKey: 'form_field_id' });
models.api_form.belongsToMany(models.api_intercomteam, 
  { as: 'intercom_teams', through: models.api_formintercomteam, foreignKey: 'form_id', otherKey: 'intercom_team_id' });

models.api_formsubmission.belongsTo(models.api_form, { as: 'form', foreignKey: 'form_id' } );
models.api_formsubmission.belongsTo(models.account_user, { as: 'user', foreignKey: 'user_id' } );
models.api_formsubmission.belongsToMany(models.api_formfield, 
  { as: 'fields', through: models.api_formfieldsubmission, foreignKey: 'form_submission_id', otherKey: 'form_field_id' });


/**
 * Define scopes
 */

models.account_user.addScope('defaultScope',
  {
    attributes: {
      exclude: [
        'is_active',
        'ethnicity_id',
        'funding_agency_id', 
        'gender_id', 
        'has_verified_email',
        'occupation_id', 
        'password',
        'region_id', 
        'research_area_id', 
        'aware_channel_id', 
        'user_institution_id'
      ]
    },
    include: [
      'emails',
      'ethnicity',
      'funding_agency',
      'gender',
      'occupation',
      { model: models.account_region, 
        as: 'region',
        include: [
          'country'
        ]
      },
      'research_area',
      'aware_channel',
      'services',
      'workshops'
    ]
  }
);

models.account_user.addScope('lite',
  {
    // attributes: {
    //   exclude: [
    //     'is_active',
    //     'ethnicity_id',
    //     'funding_agency_id', 
    //     'gender_id', 
    //     'has_verified_email',
    //     'occupation_id', 
    //     'password',
    //     'region_id', 
    //     'research_area_id', 
    //     'aware_channel_id', 
    //     'user_institution_id'
    //   ]
    // },
    include: [
      'occupation',
      { model: models.account_region, 
        as: 'region',
        include: [
          'country'
        ]
      },
      'research_area',
    ]
  }
);

// models.account_region.addScope('defaultScope',
//   {
//     attributes: {
//       exclude: ['country_id', 'countryId']
//     },
//     include: ['country']
//   }
// );

models.account_emailaddress.addScope('defaultScope', 
  {
    include: [ 
      { model: models.api_mailinglist, 
        as: 'mailing_lists', 
        through: { attributes: [] } // remove connector table
      } 
    ]
  }
);

// models.api_formgroup.addScope('defaultScope', 
//   { order: [ ['index', 'ASC'] ],
//     include: [ 
//       { model: models.api_form, 
//         as: 'forms', 
//         through: { attributes: [] } // remove connector table
//       }
//     ]
//   }
// );

// models.api_form.addScope('defaultScope', 
//   { order: [ ['sections', 'index', 'ASC'] ],
//     include: [ 
//       { model: models.api_formsection,
//         as: 'sections',
//         include: [ 'fields' ],
//         order: [ ['fields', 'index', 'ASC'] ]
//       }
//     ]
//   }
// );
// 
// models.api_service.addScope('defaultScope', 
//   { include: [
//       'powered_services',
//       'contacts',
//       'resources',
//       { model: models.api_form, 
//         as: 'forms', 
//         through: { attributes: [] } // remove connector table
//       },
//       'service_maintainer'
//     ]
//   }
// );
// 
// models.api_workshop.addScope('defaultScope', 
//   { include: [
//       { model: models.api_service, 
//         as: 'services', 
//         through: { attributes: [] } // remove connector table
//       }
//     ]
//   }
// );


/**
 * Define hooks
 */

// Automatically log changes to access request status
models.request.afterUpdate('afterUpdateRequest', 
  async (request) => {
    await models.api_accessrequestlog.create({
      access_request_id: request.id,
      status: request.status,
      message: request.message
    });
  }
);

// Automatically log changes to enrollment request status
models.api_workshopenrollmentrequest.afterUpdate('afterUpdateRequest', 
  async (request) => {
    await models.api_workshopenrollmentrequestlog.create({
      workshop_enrollment_request_id: request.id,
      status: request.status,
      message: request.message
    });
  }
);


/**
 * Define class/instance methods
 */

// Service access request
models.request.constants = {
    STATUS_REQUESTED:  'requested', 
    STATUS_PENDING:    'pending',  
    STATUS_APPROVED:   'approved', 
    STATUS_GRANTED:    'granted',  
    STATUS_DENIED:     'denied',
    MESSAGE_REQUESTED: 'Access requested.',
    MESSAGE_GRANTED:   'Access granted.',
    MESSAGE_APPROVED:  'Request approved',
    MESSAGE_PENDING:   'Sent message requesting more information',
    MESSAGE_DENIED:    'You must have a *.edu or *.gov email address associated with your account in order to use Atmosphere'
};

models.request.prototype.pend = async function() {
    this.set('status', models.request.constants.STATUS_PENDING);
    this.set('message', models.request.constants.MESSAGE_PENDING);
    await this.save();
}

models.request.prototype.approve = async function() {
    this.set('status', models.request.constants.STATUS_APPROVED);
    this.set('message', models.request.constants.MESSAGE_APPROVED);
    await this.save();
}

models.request.prototype.grant = async function() {
    this.set('status', models.request.constants.STATUS_GRANTED);
    this.set('message', models.request.constants.MESSAGE_GRANTED);
    await this.save();
}

models.request.prototype.deny = async function() {
    this.set('status', models.request.constants.STATUS_DENIED);
    this.set('message', models.request.constants.MESSAGE_DENIED);
    await this.save();
}

models.request.prototype.isApproved = function() {
    return this.status == models.request.constants.STATUS_APPROVED;
}

// Workshop enrollment request
models.api_workshopenrollmentrequest.constants = {
    STATUS_REQUESTED:  'requested',
    STATUS_PENDING:    'pending',  
    STATUS_APPROVED:   'approved',
    STATUS_GRANTED:    'granted',
    STATUS_DENIED:     'denied',
    MESSAGE_REQUESTED: 'Enrollment requested',
    MESSAGE_PENDING:   'Sent enrollment request to instructor',
    MESSAGE_APPROVED:  'Request approved',
    MESSAGE_GRANTED:   'Enrollment granted',
    MESSAGE_DENIED:    'Request denied'
};

models.api_workshopenrollmentrequest.prototype.pend = async function() {
    this.set('status', models.api_workshopenrollmentrequest.constants.STATUS_PENDING);
    this.set('message', models.api_workshopenrollmentrequest.constants.MESSAGE_PENDING);
    await this.save();
}

models.api_workshopenrollmentrequest.prototype.approve = async function() {
    this.set('status', models.api_workshopenrollmentrequest.constants.STATUS_APPROVED);
    this.set('message', models.api_workshopenrollmentrequest.constants.MESSAGE_APPROVED);
    await this.save();
}

models.api_workshopenrollmentrequest.prototype.grant = async function() {
    this.set('status', models.api_workshopenrollmentrequest.constants.STATUS_GRANTED);
    this.set('message', models.api_workshopenrollmentrequest.constants.MESSAGE_GRANTED);
    await this.save();
}

models.api_workshopenrollmentrequest.prototype.deny = async function() {
    this.set('status', models.api_workshopenrollmentrequest.constants.STATUS_DENIED);
    this.set('message', models.api_workshopenrollmentrequest.constants.MESSAGE_DENIED);
    await this.save();
}

models.api_workshopenrollmentrequest.prototype.isApproved = function() {
    return this.status == models.api_workshopenrollmentrequest.constants.STATUS_APPROVED;
}


models.sequelize = sequelize;
module.exports = models;