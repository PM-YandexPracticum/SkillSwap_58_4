import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, useCallback } from 'react'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { Carousel } from './Carousel'

type EmblaApi = UseEmblaCarouselType[1]

const meta: Meta<typeof Carousel> = {
  title: 'shared/ui/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Карусель на основе \`embla-carousel-react\`.
- Полностью управляется библиотекой, своей логики листания нет.
- Поддерживает любое количество слайдов, задаваемое через \`children\`.
- Адаптируется под ширину контейнера через \`slidesToShow\`.
- Стрелки стилизованы под макет: круглые кнопки с иконкой \`chevron-right\`, левая повёрнута на 180°.
- При наведении фон стрелок становится чуть темнее (через \`color-mix\`).
- Стрелки скрываются (становятся прозрачными и \`pointer-events: none\`), когда листать некуда.
- Через \`onApiReady\` и \`onSelect\` можно синхронизировать внешние компоненты (например, миниатюры).
- \`fullHeight\` растягивает карусель и слайды на всю высоту родителя (для галерей).
- \`loop\` включает бесконечную прокрутку (для галерей, где обе стрелки должны быть активны).
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

const GalleryLayout = ({ images, showArrows = true }: { images: string[]; showArrows?: boolean }) => {
  const [mainApi, setMainApi] = useState<EmblaApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    axis: 'y'
  })

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index)
    thumbApi?.scrollTo(index)
  }, [thumbApi])

  const scrollTo = (index: number) => {
    mainApi?.scrollTo(index)
  }

  const hasThumbs = images.length > 1
  const thumbsCount = Math.min(images.length - 1, 3)

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '16px', height: '600px' }}>

      {/* Большая карусель */}
      <div style={{
        flex: '1 1 70%',
        height: '100%',
        position: 'relative',
        borderRadius: 'var(--radius-s)',
        overflow: 'hidden'
      }}>
        <Carousel
          slidesToShow={1}
          gap={0}
          fullHeight
          loop
          showArrows={hasThumbs && showArrows}
          onApiReady={setMainApi}
          onSelect={handleSelect}
        >
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Фото ${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ))}
        </Carousel>
      </div>

      {/* Правая колонка */}
      <div style={{ flex: '1 1 30%', height: '100%' }}>
        {hasThumbs ? (
          <div
            ref={thumbRef}
            style={{
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                height: '100%'
              }}
            >
              {Array.from({ length: thumbsCount }).map((_, i) => {
                const actualIndex = (selectedIndex + i + 1) % images.length
                return (
                  <div
                    key={i}
                    onClick={() => scrollTo(actualIndex)}
                    style={{
                      flex: 1,
                      borderRadius: 'var(--radius-s)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                  >
                    <img
                      src={images[actualIndex]}
                      alt={`Мини ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                )
              })}

              {Array.from({ length: 3 - thumbsCount }).map((_, i) => (
                <div key={`empty-${i}`} style={{ flex: 1 }} />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', width: '100%' }} />
        )}
      </div>
    </div>
  )
}

const galleryImages4 = [
  '/images/skills/s01-1.jpg',
  '/images/skills/s01-2.jpg',
  '/images/skills/s01-3.jpg',
  '/images/skills/s01-4.jpg',
]

export const Gallery4Photos: Story = {
  render: () => <GalleryLayout images={galleryImages4} />,
}

const galleryImages3 = [
  '/images/skills/s07-1.jpg',
  '/images/skills/s07-2.jpg',
  '/images/skills/s07-3.jpg',
]

export const Gallery3Photos: Story = {
  render: () => <GalleryLayout images={galleryImages3} />,
}

const galleryImages1 = ['/images/skills/s01-1.jpg']

export const Gallery1Photo: Story = {
  render: () => <GalleryLayout images={galleryImages1} />,
}

export const Preview: Story = {
  render: () => <GalleryLayout images={galleryImages4} showArrows={false} />,
}

export const SimilarOffers: Story = {
  args: { slidesToShow: 4, gap: 16 },
  render: (args) => {
    const users = [
      { name: 'User1', avatar: '/images/avatars/u01.jpg' },
      { name: 'User2', avatar: '/images/avatars/u02.jpg' },
      { name: 'User3', avatar: '/images/avatars/u03.jpg' },
      { name: 'User4', avatar: '/images/avatars/u04.jpg' },
      { name: 'User5', avatar: '/images/avatars/u05.jpg' },
      { name: 'User6', avatar: '/images/avatars/u06.jpg' },
      { name: 'User7', avatar: '/images/avatars/u07.jpg' },
    ]

    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Carousel {...args}>
          {users.map((user, i) => (
            <div
              key={i}
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-s, 12px)',
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                height: '100%',
              }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '16px',
                }}
              />

              <div>{user.name}</div>
            </div>
          ))}
        </Carousel>
      </div>
    )
  },
}
