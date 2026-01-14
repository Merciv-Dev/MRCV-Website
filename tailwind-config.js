/**
 * Tailwind CSS Configuration
 * Custom theme extensions for the chat bar component
 */

(function initTailwindConfig() {
    if (typeof tailwind === 'undefined') {
        setTimeout(initTailwindConfig, 50);
        return;
    }

    tailwind.config = {
        // Disable global preflight - we handle resets in chat-bar.css scoped to #chat-bar
        corePlugins: {
            preflight: false,
        },
        theme: {
            extend: {
                colors: {
                    'neutral-05': '#0D0D0D',
                    'neutral-10': '#0D0D0C',
                    'neutral-40': '#666560',
                    'neutral-90': '#E5E5DF',
                    'neutral-95': '#F2F2ED',
                    'neutral-98': '#FAF9F5',
                    'neutral-99': '#FAF9F5',
                    'orange-50': '#ED4421',
                    'green-highlight': 'rgba(141, 220, 184, 0.25)',
                    'green-highlight-hover': 'rgba(141, 220, 184, 0.15)',
                },
                fontFamily: {
                    'dm-sans': ['DM Sans', 'sans-serif'],
                },
                borderRadius: {
                    'sm-custom': '16px',
                    'md-custom': '24px',
                    'lg-custom': '33px',
                },
            }
        }
    };

})();

