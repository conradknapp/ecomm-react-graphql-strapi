What is a Headless CMS? (https://geekflare.com/headless-cms/)

- The term “Headless” refers to lack of a frontend. A headless CMS merely contains an API and backend system where the content is stored and delivered.
- The lack of frontend is fulfilled in such a way that the content is published to an API or web service which is capable of publishing the content to any smart device.
- From the technical point of view, instead of creating relationships between the code and content, headless CMS uses API calls to render content into the webpage.
- Also, it does not require any hosts. Hence, many developers choose headless CMS over others as its easier to maintain.

Strapi Intro

- Go to https://strapi.io/getting-started
- A Content Management Framework made with Node
- Makes creating APIs lightning fast
- Give us a convenient interface
- No need to use tools like Mongoose to manually write out schema
- Very easy to make relations with data
- Can set up Strapi with many different databases, SQL or NoSQL (MongoDB, MySQL, MariaDB, PostgreSQL)
- Talk about Strapi as a headless CMS (that buzzword); talk about headless CMS in intro ('way to get started with headless CMS')
- More and more people are turning to headless CMS to power their websites
- Strapi is entirely free. To get access to other plugins, it costs money
- Give us the ability to work with cool tools like GraphQL
- Really simple commands--strapi new 'project', then start server 'strapi start'
- Show the Strapi documentation at https://strapi.io/documentation

Installation

- You're going to need at least Node >= 9 (https://strapi.io/documentation/getting-started/installation.html#requirements)
- npm install strapi@alpha -g
- Check installation with strapi -v

Strapi Commands (https://strapi.io/documentation/cli/CLI.html)

- strapi new 'projectname' to create a new project
- strapi generate:api to scaffold a complete API
- strapi install / uninstall to install / uninstall plugins
- strapi help to get all available commands
- strapi start will start up our project server
- strapi start command gives us a lot of useful logging

Adding Strapi SDK

- https://medium.com/strapi/announcing-the-strapi-javascript-sdk-ac89f140a9d1
- npm install strapi-sdk-javascript
- When you import SDK into components, use 'strapi-sdk-javascript/build/main' to only import what is necessary to create the Strapi instance

Creating our MLab Database

- https://blog.strapi.io/using-mlab-with-strapi/
- Once we set up our MLab DB, if you want to get info about it, or manage it or add a different database for production, go to 'Configurations' - 'Database'

Adding GraphQL

- Medium Post (https://medium.com/strapi/v3-alpha-12-graphql-rich-text-editor-redesigned-dashboard-25023dc4f090)
- https://strapi.io/documentation/guides/graphql.html
- Free plugin
- Available with 'strapi install graphql'
- Have access to the GraphQL playground, created by people at Prisma
- Suggest my other React / GraphQL courses if you want to go more in-depth

Taking a Basic Look at GraphQL Queries

- Using the GraphQL playground
- How to look at the schema/perform basic queries
- Looking at the 'limit', 'start', 'where', 'field' queries for the query API: https://strapi.io/documentation/guides/graphql.html#query-api
- Show how to do the 'field_contains' queries

App.js

- After creating our Restaurant/Whatever Content, create an item of it and then go to App.js to fetch it and display it in the DOM using a GraphQL query
- We show how to iterate over all of the indiviual restaurants within App.js, make the Restaurant data its own component (in Restaurant.js)

Search Field

- Show how to perform a search in two different ways: .filter() / performing a backend search with 'field_contains' and GraphQL (that code is commented out in App.js)
- When it comes time to do the GraphQL search, implement the query first in the GraphQL playground, then copy it and move to the client
- Make sure to interpolate the 'searchTerm' as surrounded in double quotes (just like in the GraphQL playground) -- "${searchTerm}", otherwise the query will always return all of the Restaurants

Creating SubProducts

- Talk about the different kinds of relations that can be defined within Strapi -- many-to-many, one-to-many, one-to-one, one-way (https://strapi.io/documentation/concepts/concepts.html#relations)

Creating the Cart Sidebar

- At first, create the cart locally within the Dishes/whatever subproduct component and then later extract it as its own dedicated file (just need to pass down 'cartItems' down as props and as well as bring in the displayPrice utility function to the new component)

Navbar

- Create Navbar
- Make Auth / UnAuth navbars
- Show the simple API to entice others to play around with Gestalt (i.e. give the Box a 'rounded' property)
- Give Navbar 'NavLinks'. Give them each the activeClassName="active" prop and create a new 'active' class that corresponds to it
- Show the fact that the active styles are applied with the active class but you need to add the 'exact' keyword for the home route otherwise active styles are applied no matter the route

Setting up Google Provider for Authentication

- OAuth Client (https://console.developers.google.com/)
- Guide: https://github.com/strapi/strapi-examples/blob/master/login-react/doc/google_setup.md
- Basically, show how to use the Google + Api to add a JavaScript project, it will ask for your callback url (http://localhost:1337/connect/google/callback). You will provide a link with the callback part removed in Signin Page
- Go to Admin, enable Google Provider and add all the necessary things (secret, key, url, callback url)
- Also useful for creating the markup: https://blog.strapi.io/protected-routes-and-authentication-with-react-and-node-js/
- In the 'Restrictions' part of your App in the Google + API (see screenshot in project folder), add two values:
- Provide a 'Authorized JS origin' of 'http://localhost:3000'
- Provide an 'Authorized redirect URI' of 'http://localhost:1337/connect/google/callback'
- In the Admin panel--

Signin Form

- Provide options both for JWT signin as well as Google Provider
- For Google Provider add a link within local state to the Google Provider url. If you want to enable other providers, you just have to change the end of the path--'http://localhost:1337/connect/<provider>'
- Add a link to the Google Provider underneath thte Signin to googleProviderUrl. They will provide their credentials and in the componentDidMount of Signin, we use (strapi.authenticateProvider('google;'), get the response value from the operation and grab the token and put it in localStorage as well as the user information, then we want to redirect the user to the home page, where the navbar should change its contents according to the getToken() conditional it has
- We'll add a toast notification if there is an error in authentication...

Toast

- First create a toast component that is only for errors (within the Signin component) and when we need it to be available for the Checkout component, make its own file (ToastMessage.js) and change its API so that we can display either error or success messages and declaratively control whether it is shown or not
- We'll create a new component called ToastMessage.js, bring in Text and Box, and give it errorToast and errorMessage props (The previous Toast component that was locally created in Signin.js is commented out)

Stripe

- We wil need to have users sign up with Stripe (go through that process)
- There will be a couple of keys they will give us for testing (we will use a different set of keys for deployment)
- Install the package 'react-stripe-elements'
- Talk about the structure of the components that we will need for Stripe to work within our React components

Loader

- Show the default pinterest spinner with its show API (and how it doesn't look good)
- Download react-spinners
- Show http://www.davidhu.io/react-spinners/, show that you can play around with sizes. Play around with loader you want (GridLoader), and then grab it, import it
- Grab it and put it in the original spinner's place.
- Show how you can implement that same API as the Gestalt spinner (of show by passing it as a prop)
- Note: Also talk about the color prop for each of the images (that you can show a default color when loading; set network to Fast 3G to display this neat feature / maybe create a random color function)

Prep for Deployment

- Remove console logs
- Add Domain Authentication for SendGrid so you can use an email other than test@example.com
- Add the official Stripe keys (not test keys)

Deployment (Backend)

- We need to add security settings before deployment!
- We should change our CORS settings, our origin, and add XSS protection, add GZip
- We can add a different default language to our application if we like
- Use Heroku to deploy our backend. Since Strapi is Node-based, we can deploy it just like any Node project (pass it environment variables)
- https://blog.strapi.io/deploying-a-strapi-api-on-heroku/
- Note: If the admin panel is exposed upon deployment and you want to hide it, you can modify it here (https://strapi.io/documentation/advanced/customize-admin.html#change-access-url)

Deployment (Now)

- Use Now to deploy our frontend; make use of cool alias feature

General Reference:

- https://blog.strapi.io/building-a-static-website-using-gatsby-and-strapi/
- https://medium.com/strapi/announcing-the-strapi-javascript-sdk-ac89f140a9d1
- https://github.com/strapi/strapi-examples/issues/18
- https://github.com/strapi/strapi-examples/tree/master/login-react
- https://pinterest.github.io/gestalt
- https://snipcart.com/blog/node-js-react-strapi-tutorial

Lecture Plan:

- Overview of Gestalt, Gestalt API, How Most of Our Components will be structured with Gestalt
- Overview of the Box API, quick demo on how to work with flexbox (before creating our first query within the App.sj component), show the guide that's available in the Gestalt documentation

Setting up Email Service

- How to setup mailgun to send emails (https://github.com/strapi/strapi/issues/552)
- Go to server/plugins/email/controllers/Email.js to modify settings

- npm install strapi-email-sendgrid@alpha (or strapi-email-mailgun)
  = Install sendgrid plugin: npm install strapi-email-sendgrid
- Go to sendgrid and sign up (no need to provide credit card), verify account for more than starter amount of 100 emails / day, choose Node.js
- Walk through each of the steps: adding env (by pasting lines into terminal), no need to install @sendgrid/mail (the strapi-email-sendgrid package itself takes in the @sendgrid/mail package and configures our app according to the values we give it)
- We can provide these values at /admin/plugins/email/configurations/development (the API key, default to and reply-to values)
