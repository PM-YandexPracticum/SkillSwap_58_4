import { SkillGallery } from '@/entities/skill'
import EditIcon from '@/shared/assets/icons/edit.svg?react'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'

import styles from './SkillPreviewModal.module.css'

/** Данные навыка для превью; названия категорий приходят готовыми — справочник окно не знает. */
export interface SkillPreviewData {
  title: string
  description: string
  categoryTitle: string
  subcategoryTitle: string
}

export interface SkillPreviewModalProps {
  isOpen: boolean
  skill: SkillPreviewData
  /** Адреса фото для галереи (`blob:`, `data:` или путь из «базы»); сама галерея ничего не создаёт и не загружает */
  images: readonly string[]
  /** «Редактировать», Esc и клик по фону: окно закрывается, пользователь возвращается к форме */
  onEdit: () => void
  /** «Готово»: регистрация завершается (P6-06) */
  onConfirm: () => void
  /** Отключает действия, пока завершается сохранение. */
  isBusy?: boolean
  /** Понятная ошибка завершения регистрации. */
  error?: string | null
  /** После сохранения навыка редактирование запретить, чтобы повтор использовал прежние id. */
  isEditDisabled?: boolean
}

/**
 * Превью созданного навыка на шаге 3: по центру «Ваше предложение» и «Пожалуйста, проверьте и подтвердите
 * правильность данных»; слева название, «Категория / Подкатегория», описание и кнопки «Редактировать ✎» / «Готово»;
 * справа галерея: общий SkillGallery с главным фото и колонкой мини-превью, как на странице навыка. При одном фото — просто картинка.
 * «Редактировать», Esc и клик по фону возвращают к форме; «Готово» вызывает onConfirm.
 * Сохранение и завершение регистрации подключит P6-06.
 * Построено на `shared/ui/Modal`; внутренние отступы задаёт содержимое, высокое окно прокручивается само.
 * @see Figma: «Регистрация 3 шаг - модальное окно ваше предложение» (1:1799)
 */
export function SkillPreviewModal({
  isOpen,
  skill,
  images,
  onEdit,
  onConfirm,
  isBusy = false,
  error,
  isEditDisabled = false,
}: SkillPreviewModalProps) {
  const categories = [skill.categoryTitle, skill.subcategoryTitle].filter(Boolean).join(' / ')
  return (
    <Modal isOpen={isOpen} onClose={onEdit} ariaLabel="Ваше предложение">
      <div className={styles.content}>
        <header className={styles.header}>
          <h2 className={styles.title}>Ваше предложение</h2>
          <p className={styles.subtitle}>Пожалуйста, проверьте и подтвердите правильность данных</p>
        </header>
        <div className={styles.body}>
          <div className={styles.info}>
            <div className={styles.text}>
              <div className={styles.heading}>
                <h3 className={styles.skillTitle}>{skill.title}</h3>
                {categories && <p className={styles.categories}>{categories}</p>}
              </div>
              <p className={styles.description}>{skill.description}</p>
            </div>
            <div className={styles.actions}>
              <Button variant="secondary" onClick={onEdit} disabled={isBusy || isEditDisabled}>
                Редактировать
                <EditIcon className={styles.icon} aria-hidden="true" />
              </Button>
              <Button onClick={onConfirm} disabled={isBusy}>
                {isBusy ? 'Сохраняем…' : 'Готово'}
              </Button>
            </div>
          </div>
          <SkillGallery title={skill.title} images={images} />
        </div>
        {error && <p role="alert">{error}</p>}
      </div>
    </Modal>
  )
}
