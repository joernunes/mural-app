import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
  const text = url.searchParams.get('text') || 'Uma nota no mural';
  const author = url.searchParams.get('author') || 'anónimo';
  const hue = parseInt(url.searchParams.get('hue') || '80', 10);

  const noteColor = `hsl(${hue}, 78%, 72%)`;
  const noteColorDark = `hsl(${hue}, 50%, 22%)`;
  const accentGlow = `hsl(${hue}, 80%, 50%)`;

  const displayText = text.length > 140 ? text.slice(0, 137) + '…' : text;

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#171220',
          padding: '50px 60px',
          fontFamily: 'sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: 30,
                      fontWeight: 700,
                      color: '#f4f1ea',
                      letterSpacing: '-0.02em',
                    },
                    children: 'mural',
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: 16,
                      color: '#b6aec9',
                    },
                    children: 'escreve. deixa. alguém vai encontrar.',
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                background: noteColor,
                borderRadius: '18px',
                padding: '50px 52px',
                justifyContent: 'space-between',
                boxShadow: `8px 10px 0px rgba(0,0,0,0.35), 0 0 80px ${accentGlow}33`,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: displayText.length > 80 ? 36 : 44,
                      fontWeight: 600,
                      color: '#17131f',
                      lineHeight: 1.35,
                    },
                    children: displayText,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      marginTop: '24px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: 22,
                            color: noteColorDark,
                            fontWeight: 500,
                          },
                          children: `— ${author}`,
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: 14,
                            color: noteColorDark,
                            opacity: 0.6,
                          },
                          children: 'mural.app',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
    }
  );
}
