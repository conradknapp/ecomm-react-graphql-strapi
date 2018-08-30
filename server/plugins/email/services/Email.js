"use strict";

/**
 * Email.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const _ = require("lodash");
// const mailgun = require("mailgun-js")({
//   apiKey: "218840843ea40b85ecad1dfb60bc9c4b-c1fe131e-80c7d998",
//   domain:
//     "https://app.mailgun.com/app/domains/sandboxd24b1fbda3924999abff5c3ae54de809.mailgun.org"
// });
// SendGrid Setup
// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createDefaultEnvConfig = async env => {
  const pluginStore = strapi.store({
    environment: env,
    type: "plugin",
    name: "email"
  });

  const provider = _.find(strapi.plugins.email.config.providers, {
    // Change provider manually to send grid
    provider: "sendmail"
  });

  const value = _.assign({}, provider, {});

  await pluginStore.set({ key: "provider", value });
  return await strapi
    .store({
      environment: env,
      type: "plugin",
      name: "email"
    })
    .get({ key: "provider" });
};

const getProviderConfig = async env => {
  let config = await strapi
    .store({
      environment: env,
      type: "plugin",
      name: "email"
    })
    .get({ key: "provider" });

  if (!config) {
    config = await createDefaultEnvConfig(env);
  }

  return config;
};

module.exports = {
  getProviderConfig,
  send: async (options, config, cb) => {
    // Create message object that is being sent from HTTP request in our React app
    // console.log(options);
    // var message = {
    //   from: options.from,
    //   to: options.to,
    //   subject: options.subject,
    //   text: options.text,
    //   html: options.html
    // };

    // Send off our email
    // const msg = {
    //   to: 'test@example.com',
    //   from: 'test@example.com',
    //   subject: 'Sending with SendGrid is Fun',
    //   text: 'and easy to do anywhere, even with Node.js',
    //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    // };
    // await sgMail.send(message);
    // mailgun.messages().send(data, (err, body) => {
    //   console.log(body);
    // });

    // Get email provider settings to configure the provider to use.
    if (!config) {
      config = await getProviderConfig(strapi.config.environment);
    }

    const provider = _.find(strapi.plugins.email.config.providers, {
      provider: config.provider
    });

    if (!provider) {
      throw new Error(
        `The provider package isn't installed. Please run \`npm install strapi-email-${
          config.provider
        }\``
      );
    }

    const actions = provider.init(config);

    // Execute email function of the provider for all files.
    return actions.send(options, cb);
  }
};
