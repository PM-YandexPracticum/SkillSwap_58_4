export type { Category, Subcategory } from './model/types'
export { categoriesReducer, fetchCategories, type CategoriesState } from './model/categoriesSlice'
export {
  selectCategories,
  selectCategoriesStatus,
  selectSubcategoryById,
  selectCategoryBySubcategoryId,
  selectCategoryColor,
} from './model/selectors'
export { getCategories } from './api/categoryApi'
export { CategoryIcon, type CategoryIconProps } from './ui/CategoryIcon'
export { CategorySubcategorySelect } from './ui/CategorySubcategorySelect'
export { getAvailableSubcategories, syncCategorySelection } from './lib/linkCategories'

export { findSubcategories } from './lib/findSubcategories'
