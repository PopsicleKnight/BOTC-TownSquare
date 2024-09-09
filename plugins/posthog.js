import posthog from 'posthog-js';

export default {
  install(app) {
    const posthogKey = import.meta.env.VITE_POSTHOG_KEY || "phc_KKHHdP5dRp0Pe9zQNIKxI7EjkNZRY3LD5oN1yQocEwb";
    const posthogHost = import.meta.env.VITE_POSTHOG_HOST || "https://eu.i.posthog.com";

    if (!posthogKey) {
      console.error('PostHog key is not defined');
      return;
    }

    if (!posthogHost) {
      console.error('PostHog host is not defined');
      return;
    }

    posthog.init(posthogKey, {
      api_host: posthogHost,
    });

    app.config.globalProperties.$posthog = posthog;
  },
};
