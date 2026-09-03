package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.data.local.AppDatabase
import com.example.data.model.DifficultyLevel
import com.example.data.model.MatchResult
import com.example.data.model.NutritionInfo
import com.example.data.model.Recipe
import com.example.data.model.RecipeCategory
import com.example.data.model.SpiceLevel
import com.example.data.repository.CookbookDataSource
import com.example.data.repository.RecipeRepository
import com.example.util.UnitSystem
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

sealed class ScreenDestination {
  object Explore : ScreenDestination()
  object PantryMatcher : ScreenDestination()
  object IndexCatalog : ScreenDestination()
  object HeritageNotes : ScreenDestination()
  object PrintExport : ScreenDestination()
  data class Detail(val recipeId: String) : ScreenDestination()
}

enum class RecipeQuickFilter(val label: String) {
  ALL("All Dishes"),
  FAVORITES("Favorites"),
  TOP_RATED("Top Rated ★"),
  GLUTEN_FREE("Gluten-Free 🌾"),
  VEGAN("Vegan 🌱"),
  SPICY("Spicy Kick 🌶️"),
  EASY("Easy Prep"),
  FAMILY_HERITAGE("Family Classics"),
  VEGETARIAN("Vegetarian"),
  QUICK("Quick (<30m)")
}

enum class MatcherFilter(val label: String) {
  CAN_COOK_NOW("Ready to Cook (100%)"),
  MISSING_1_2("Missing 1–2 items"),
  ALL_MATCHES("All Matches")
}

enum class IndexViewMode {
  ALPHABETICAL_A_TO_Z,
  BY_CATEGORY,
  BY_CONTRIBUTOR
}

class CookbookViewModel(application: Application) : AndroidViewModel(application) {

  private val repository: RecipeRepository

  init {
    val db = AppDatabase.getDatabase(application)
    repository = RecipeRepository(db.cookbookDao())
  }

  // Navigation
  private val _currentScreen = MutableStateFlow<ScreenDestination>(ScreenDestination.Explore)
  val currentScreen: StateFlow<ScreenDestination> = _currentScreen.asStateFlow()

  fun navigateTo(destination: ScreenDestination) {
    _currentScreen.value = destination
  }

  fun navigateBack() {
    if (_currentScreen.value is ScreenDestination.Detail) {
      _currentScreen.value = ScreenDestination.Explore
    }
  }

  // Search & Filters in Explore
  private val _searchQuery = MutableStateFlow("")
  val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

  private val _selectedCategory = MutableStateFlow<RecipeCategory?>(null)
  val selectedCategory: StateFlow<RecipeCategory?> = _selectedCategory.asStateFlow()

  private val _selectedFilter = MutableStateFlow(RecipeQuickFilter.ALL)
  val selectedFilter: StateFlow<RecipeQuickFilter> = _selectedFilter.asStateFlow()

  private val _selectedDifficulty = MutableStateFlow<DifficultyLevel?>(null)
  val selectedDifficulty: StateFlow<DifficultyLevel?> = _selectedDifficulty.asStateFlow()

  // Favorites from Room
  val favoriteRecipeIds: StateFlow<Set<String>> = repository.favoriteRecipeIds
    .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptySet())

  // User ratings from Room
  val userRatings: StateFlow<Map<String, Int>> = repository.allRatings
    .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyMap())

  fun rateRecipe(recipeId: String, rating: Int) {
    viewModelScope.launch {
      repository.saveRecipeRating(recipeId, rating)
    }
  }

  fun getEffectiveRating(recipe: Recipe): Pair<Float, Int> {
    val userRate = userRatings.value[recipe.id]
    if (userRate == null) {
      return recipe.defaultRating to recipe.ratingCount
    }
    val newCount = recipe.ratingCount + 1
    val newAvg = ((recipe.defaultRating * recipe.ratingCount) + userRate) / newCount
    val rounded = (Math.round(newAvg * 10.0) / 10.0).toFloat()
    return rounded to newCount
  }

  // Auto-tag filtering
  private val _selectedAutoTag = MutableStateFlow<String?>(null)
  val selectedAutoTag: StateFlow<String?> = _selectedAutoTag.asStateFlow()

  fun selectAutoTag(tag: String?) {
    _selectedAutoTag.value = if (_selectedAutoTag.value == tag) null else tag
  }

  // Recipe-level spicy customization preference
  private val _recipeSpiceCustomization = MutableStateFlow<Map<String, SpiceLevel>>(emptyMap())
  val recipeSpiceCustomization: StateFlow<Map<String, SpiceLevel>> = _recipeSpiceCustomization.asStateFlow()

  fun setRecipeCustomSpice(recipeId: String, spiceLevel: SpiceLevel) {
    _recipeSpiceCustomization.value = _recipeSpiceCustomization.value + (recipeId to spiceLevel)
  }

  fun getEffectiveSpiceLevel(recipe: Recipe): SpiceLevel {
    return _recipeSpiceCustomization.value[recipe.id] ?: recipe.calculatedSpiceLevel
  }

  private data class FilterState(
    val filter: RecipeQuickFilter,
    val difficulty: DifficultyLevel?,
    val autoTag: String?,
    val favs: Set<String>,
    val ratings: Map<String, Int>
  )

  private val _filterState = combine(
    _selectedFilter,
    _selectedDifficulty,
    _selectedAutoTag,
    favoriteRecipeIds,
    userRatings
  ) { filter, difficulty, autoTag, favs, ratings ->
    FilterState(filter, difficulty, autoTag, favs, ratings)
  }

  // Filtered recipes
  val filteredRecipes: StateFlow<List<Recipe>> = combine(
    _searchQuery,
    _selectedCategory,
    _filterState
  ) { query, category, state ->
    var list = repository.search(query, category)

    if (state.difficulty != null) {
      list = list.filter { it.calculatedDifficulty == state.difficulty }
    }

    if (state.autoTag != null) {
      list = list.filter { it.autoTags.contains(state.autoTag) }
    }

    when (state.filter) {
      RecipeQuickFilter.ALL -> list
      RecipeQuickFilter.FAVORITES -> list.filter { state.favs.contains(it.id) }
      RecipeQuickFilter.TOP_RATED -> list.filter { recipe ->
        val userR = state.ratings[recipe.id]
        val score = if (userR != null) {
          ((recipe.defaultRating * recipe.ratingCount) + userR.toFloat()) / (recipe.ratingCount + 1)
        } else {
          recipe.defaultRating
        }
        score >= 4.8f
      }
      RecipeQuickFilter.GLUTEN_FREE -> list.filter { it.autoTags.contains("Gluten-Free") }
      RecipeQuickFilter.VEGAN -> list.filter { it.autoTags.contains("Vegan") }
      RecipeQuickFilter.SPICY -> list.filter { it.calculatedSpiceLevel != SpiceLevel.MILD }
      RecipeQuickFilter.EASY -> list.filter { it.calculatedDifficulty == DifficultyLevel.EASY }
      RecipeQuickFilter.FAMILY_HERITAGE -> list.filter {
        it.contributor.contains("Rosina", ignoreCase = true) ||
          it.contributor.contains("Sandy", ignoreCase = true) ||
          it.contributor.contains("Ornella", ignoreCase = true) ||
          it.contributor.contains("Bruna", ignoreCase = true) ||
          it.contributor.contains("Elvira", ignoreCase = true) ||
          it.contributor.contains("Teresa", ignoreCase = true)
      }
      RecipeQuickFilter.VEGETARIAN -> list.filter {
        it.tags.any { tag -> tag.contains("Vegetarian", ignoreCase = true) } || it.autoTags.contains("Vegetarian")
      }
      RecipeQuickFilter.QUICK -> list.filter {
        it.cookTime.contains("5 min") || it.cookTime.contains("10 min") ||
          it.cookTime.contains("12 min") || it.cookTime.contains("15 min") ||
          it.cookTime.contains("20 min") || it.cookTime.contains("None") ||
          it.autoTags.contains("Under 30 Min")
      }
    }
  }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), CookbookDataSource.allRecipes)

  fun onSearchQueryChanged(newQuery: String) {
    _searchQuery.value = newQuery
  }

  fun onCategorySelected(category: RecipeCategory?) {
    _selectedCategory.value = if (_selectedCategory.value == category) null else category
  }

  fun onFilterSelected(filter: RecipeQuickFilter) {
    _selectedFilter.value = filter
  }

  fun onDifficultySelected(difficulty: DifficultyLevel?) {
    _selectedDifficulty.value = if (_selectedDifficulty.value == difficulty) null else difficulty
  }

  fun toggleFavorite(recipeId: String) {
    viewModelScope.launch {
      val isFav = favoriteRecipeIds.value.contains(recipeId)
      repository.toggleFavorite(recipeId, isFav)
    }
  }

  // --- Pantry Matcher ---
  val pantryItems = repository.pantryItems
    .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

  private val _newIngredientText = MutableStateFlow("")
  val newIngredientText: StateFlow<String> = _newIngredientText.asStateFlow()

  private val _matcherFilter = MutableStateFlow(MatcherFilter.ALL_MATCHES)
  val matcherFilter: StateFlow<MatcherFilter> = _matcherFilter.asStateFlow()

  val pantryMatches: StateFlow<List<MatchResult>> = combine(
    pantryItems,
    _matcherFilter
  ) { items, filter ->
    val names = items.map { it.name }.toSet()
    val allMatches = repository.matchWithPantry(names)
    when (filter) {
      MatcherFilter.CAN_COOK_NOW -> allMatches.filter { it.missingIngredients.isEmpty() }
      MatcherFilter.MISSING_1_2 -> allMatches.filter { it.missingIngredients.size in 1..2 }
      MatcherFilter.ALL_MATCHES -> allMatches
    }
  }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

  fun onNewIngredientTextChanged(text: String) {
    _newIngredientText.value = text
  }

  fun addPantryIngredient(name: String) {
    viewModelScope.launch {
      repository.addPantryItem(name)
      _newIngredientText.value = ""
    }
  }

  fun removePantryIngredient(name: String) {
    viewModelScope.launch {
      repository.removePantryItem(name)
    }
  }

  fun clearAllPantry() {
    viewModelScope.launch {
      repository.clearPantry()
    }
  }

  fun setMatcherFilter(filter: MatcherFilter) {
    _matcherFilter.value = filter
  }

  // Add all ingredients of a recipe into pantry
  fun addRecipeIngredientsToPantry(recipe: Recipe) {
    viewModelScope.launch {
      recipe.ingredients.forEach {
        repository.addPantryItem(it.normalizedName)
      }
    }
  }

  // Pre-seed some default common ingredients on first launch or demo
  fun seedCommonPantry() {
    viewModelScope.launch {
      listOf("eggs", "garlic", "olive oil", "flour", "sugar", "parmesan", "tomatoes", "onion", "pasta")
        .forEach { repository.addPantryItem(it) }
    }
  }

  // --- Index Catalog ---
  private val _indexMode = MutableStateFlow(IndexViewMode.ALPHABETICAL_A_TO_Z)
  val indexMode: StateFlow<IndexViewMode> = _indexMode.asStateFlow()

  private val _selectedLetter = MutableStateFlow<Char?>('A')
  val selectedLetter: StateFlow<Char?> = _selectedLetter.asStateFlow()

  fun setIndexMode(mode: IndexViewMode) {
    _indexMode.value = mode
  }

  fun setSelectedLetter(letter: Char?) {
    _selectedLetter.value = letter
  }

  /**
   * Sorts a list of recipes alphabetically by title for the index view.
   */
  fun sortRecipesAlphabetically(recipes: List<Recipe> = repository.allRecipes): List<Recipe> {
    return recipes.sortedWith(compareBy(String.CASE_INSENSITIVE_ORDER) { it.title.trim() })
  }

  /**
   * Returns all recipes sorted alphabetically by title for the index view.
   */
  fun getAlphabeticallySortedRecipes(): List<Recipe> {
    return sortRecipesAlphabetically(repository.allRecipes)
  }

  /**
   * Returns a map of letter to sorted recipes for the alphabetical index view.
   */
  fun getAlphabeticalIndexMap(): Map<Char, List<Recipe>> {
    return getAlphabeticallySortedRecipes()
      .groupBy { it.title.trim().first().uppercaseChar() }
      .mapValues { (_, recipes) -> sortRecipesAlphabetically(recipes) }
      .toSortedMap()
  }

  val alphabeticalMap: Map<Char, List<Recipe>> by lazy {
    getAlphabeticalIndexMap()
  }

  /**
   * Computes the item index in LazyColumn for a given alphabetical section header,
   * enabling fast-scrolling to any letter.
   */
  fun getLazyListIndexForLetter(letter: Char): Int? {
    var index = 0
    for ((sectionLetter, recipes) in alphabeticalMap) {
      if (sectionLetter == letter.uppercaseChar()) {
        return index
      }
      index += 1 + recipes.size // 1 for header + recipe items
    }
    return null
  }

  /**
   * Returns a map of letter to its corresponding item index in the LazyColumn for fast-scrolling.
   */
  fun getAlphabeticalScrollIndices(): Map<Char, Int> {
    val map = mutableMapOf<Char, Int>()
    var currentIndex = 0
    for ((letter, recipes) in alphabeticalMap) {
      map[letter] = currentIndex
      currentIndex += 1 + recipes.size
    }
    return map
  }

  /**
   * Determines the active letter given the visible item index in the LazyColumn.
   */
  fun getLetterForScrollIndex(firstVisibleItemIndex: Int): Char? {
    var currentIndex = 0
    for ((letter, recipes) in alphabeticalMap) {
      val sectionLength = 1 + recipes.size
      if (firstVisibleItemIndex in currentIndex until (currentIndex + sectionLength)) {
        return letter
      }
      currentIndex += sectionLength
    }
    return alphabeticalMap.keys.firstOrNull()
  }

  val categoryMap: Map<RecipeCategory, List<Recipe>> by lazy {
    repository.getCategoryIndex()
  }

  val contributorMap: Map<String, List<Recipe>> by lazy {
    CookbookDataSource.allRecipes
      .groupBy { it.contributor }
      .toSortedMap()
  }

  // --- Recipe Detail Screen State ---
  private val _checkedIngredients = MutableStateFlow<Set<String>>(emptySet())
  val checkedIngredients: StateFlow<Set<String>> = _checkedIngredients.asStateFlow()

  private val _servingMultiplier = MutableStateFlow(1.0f)
  val servingMultiplier: StateFlow<Float> = _servingMultiplier.asStateFlow()

  // Unit System Conversion: Imperial vs Metric
  private val _unitSystem = MutableStateFlow(UnitSystem.IMPERIAL)
  val unitSystem: StateFlow<UnitSystem> = _unitSystem.asStateFlow()

  fun setUnitSystem(system: UnitSystem) {
    _unitSystem.value = system
  }

  // Hands-Free Mode with jumbo tap targets and voice navigation
  private val _isHandsFreeActive = MutableStateFlow(false)
  val isHandsFreeActive: StateFlow<Boolean> = _isHandsFreeActive.asStateFlow()

  private val _handsFreeStepIndex = MutableStateFlow(0)
  val handsFreeStepIndex: StateFlow<Int> = _handsFreeStepIndex.asStateFlow()

  fun openHandsFree(initialStep: Int = 0) {
    _handsFreeStepIndex.value = initialStep.coerceAtLeast(0)
    _isHandsFreeActive.value = true
  }

  fun closeHandsFree() {
    _isHandsFreeActive.value = false
  }

  fun nextHandsFreeStep(totalSteps: Int) {
    if (_handsFreeStepIndex.value < totalSteps - 1) {
      _handsFreeStepIndex.value += 1
    }
  }

  fun prevHandsFreeStep() {
    if (_handsFreeStepIndex.value > 0) {
      _handsFreeStepIndex.value -= 1
    }
  }

  fun setHandsFreeStep(step: Int) {
    _handsFreeStepIndex.value = step.coerceAtLeast(0)
  }

  // Print & Keepsake Book Export
  private val _isPrintExportOpen = MutableStateFlow(false)
  val isPrintExportOpen: StateFlow<Boolean> = _isPrintExportOpen.asStateFlow()

  private val _printExportRecipeId = MutableStateFlow<String?>(null)
  val printExportRecipeId: StateFlow<String?> = _printExportRecipeId.asStateFlow()

  fun openPrintExport(recipeId: String? = null) {
    _printExportRecipeId.value = recipeId
    _isPrintExportOpen.value = true
  }

  fun closePrintExport() {
    _isPrintExportOpen.value = false
  }

  private val _activeRecipeNote = MutableStateFlow("")
  val activeRecipeNote: StateFlow<String> = _activeRecipeNote.asStateFlow()

  fun toggleIngredientChecked(ingredientText: String) {
    val current = _checkedIngredients.value.toMutableSet()
    if (current.contains(ingredientText)) {
      current.remove(ingredientText)
    } else {
      current.add(ingredientText)
    }
    _checkedIngredients.value = current
  }

  fun setServingMultiplier(multiplier: Float) {
    _servingMultiplier.value = multiplier
  }

  fun loadRecipeNotes(recipeId: String) {
    _checkedIngredients.value = emptySet()
    _servingMultiplier.value = 1.0f
    viewModelScope.launch {
      repository.getRecipeNote(recipeId).collect { note ->
        _activeRecipeNote.value = note ?: ""
      }
    }
  }

  fun saveActiveRecipeNote(recipeId: String, note: String) {
    _activeRecipeNote.value = note
    viewModelScope.launch {
      repository.saveRecipeNote(recipeId, note)
    }
  }

  // Enhanced Cooking Timer
  private val _timerTotalSeconds = MutableStateFlow(0)
  val timerTotalSeconds: StateFlow<Int> = _timerTotalSeconds.asStateFlow()

  private val _timerSecondsRemaining = MutableStateFlow(0)
  val timerSecondsRemaining: StateFlow<Int> = _timerSecondsRemaining.asStateFlow()

  private val _isTimerRunning = MutableStateFlow(false)
  val isTimerRunning: StateFlow<Boolean> = _isTimerRunning.asStateFlow()

  private val _timerLabel = MutableStateFlow("Kitchen Timer")
  val timerLabel: StateFlow<String> = _timerLabel.asStateFlow()

  private val _isTimerAlertTriggered = MutableStateFlow(false)
  val isTimerAlertTriggered: StateFlow<Boolean> = _isTimerAlertTriggered.asStateFlow()

  private var timerJob: Job? = null

  fun startRecipeTimer(recipe: Recipe) {
    val mins = parseMinutesFromCookTime(recipe.cookTime)
    startTimer(mins, label = "${recipe.title} (${mins}m)")
  }

  fun startTimer(minutes: Int, label: String = "Kitchen Timer") {
    timerJob?.cancel()
    val total = (minutes * 60).coerceAtLeast(10)
    _timerTotalSeconds.value = total
    _timerSecondsRemaining.value = total
    _timerLabel.value = label
    _isTimerRunning.value = true
    _isTimerAlertTriggered.value = false

    timerJob = viewModelScope.launch {
      while (_timerSecondsRemaining.value > 0 && _isTimerRunning.value) {
        delay(1000L)
        _timerSecondsRemaining.value -= 1
      }
      if (_timerSecondsRemaining.value <= 0) {
        _isTimerRunning.value = false
        _isTimerAlertTriggered.value = true
      }
    }
  }

  fun addTimerMinutes(minutes: Int) {
    val deltaSec = minutes * 60
    val updated = (_timerSecondsRemaining.value + deltaSec).coerceAtLeast(0)
    _timerSecondsRemaining.value = updated
    if (updated > _timerTotalSeconds.value) {
      _timerTotalSeconds.value = updated
    }
  }

  fun pauseResumeTimer() {
    if (_isTimerRunning.value) {
      _isTimerRunning.value = false
      timerJob?.cancel()
    } else if (_timerSecondsRemaining.value > 0) {
      _isTimerRunning.value = true
      _isTimerAlertTriggered.value = false
      timerJob = viewModelScope.launch {
        while (_timerSecondsRemaining.value > 0 && _isTimerRunning.value) {
          delay(1000L)
          _timerSecondsRemaining.value -= 1
        }
        if (_timerSecondsRemaining.value <= 0) {
          _isTimerRunning.value = false
          _isTimerAlertTriggered.value = true
        }
      }
    }
  }

  fun resetTimer() {
    timerJob?.cancel()
    _isTimerRunning.value = false
    _timerSecondsRemaining.value = 0
    _timerTotalSeconds.value = 0
    _isTimerAlertTriggered.value = false
  }

  fun dismissTimerAlert() {
    _isTimerAlertTriggered.value = false
  }

  private fun parseMinutesFromCookTime(cookTimeStr: String): Int {
    val clean = cookTimeStr.lowercase()
    return when {
      clean.contains("hr") || clean.contains("hour") -> {
        val match = Regex("""(\d+)""").find(clean)
        val hours = match?.value?.toIntOrNull() ?: 1
        hours * 60
      }
      clean.contains("min") -> {
        val matches = Regex("""(\d+)""").findAll(clean).mapNotNull { it.value.toIntOrNull() }.toList()
        matches.maxOrNull() ?: 15
      }
      else -> 15
    }
  }

  fun getRecipeById(id: String): Recipe? = repository.getRecipeById(id)
}

class CookbookViewModelFactory(private val application: Application) : ViewModelProvider.Factory {
  override fun <T : ViewModel> create(modelClass: Class<T>): T {
    if (modelClass.isAssignableFrom(CookbookViewModel::class.java)) {
      @Suppress("UNCHECKED_CAST")
      return CookbookViewModel(application) as T
    }
    throw IllegalArgumentException("Unknown ViewModel class")
  }
}
