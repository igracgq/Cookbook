package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ExampleRobolectricTest {

  @Test
  fun `read string from context`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val appName = context.getString(R.string.app_name)
    assertEquals("Heritage Cookbook", appName)
  }

  @Test
  fun `verify cookbook data source loaded authentic recipes`() {
    val recipes = com.example.data.repository.CookbookDataSource.allRecipes
    assert(recipes.isNotEmpty())
    assert(recipes.any { it.title.contains("Gnocchi", ignoreCase = true) })
    assert(recipes.any { it.title.contains("Osso Buco", ignoreCase = true) })
    assert(recipes.any { it.title.contains("Taralle", ignoreCase = true) })
  }

  @Test
  fun `verify pantry matcher finds recipes by ingredients`() {
    val results = com.example.data.repository.CookbookDataSource.matchByIngredients(
      setOf("eggs", "pancetta", "spaghetti", "parmesan")
    )
    assert(results.isNotEmpty())
    val carbonaraMatch = results.find { it.recipe.id == "spaghetti_carbonara" }
    assert(carbonaraMatch != null)
    assert(carbonaraMatch!!.matchPercentage > 50)
  }

  @Test
  fun `verify viewModel sorts recipes alphabetically by title for index view`() {
    val context = ApplicationProvider.getApplicationContext<android.app.Application>()
    val viewModel = com.example.ui.viewmodel.CookbookViewModel(context)

    val sortedRecipes = viewModel.getAlphabeticallySortedRecipes()
    assert(sortedRecipes.isNotEmpty())

    // Verify list is sorted in ascending alphabetical order by title (case-insensitive)
    for (i in 0 until sortedRecipes.size - 1) {
      val current = sortedRecipes[i].title.trim()
      val next = sortedRecipes[i + 1].title.trim()
      val comparison = String.CASE_INSENSITIVE_ORDER.compare(current, next)
      assert(comparison <= 0) {
        "Recipes not sorted: '$current' appeared before '$next'"
      }
    }
  }

  @Test
  fun `verify fast-scrolling index calculations in viewModel`() {
    val context = ApplicationProvider.getApplicationContext<android.app.Application>()
    val viewModel = com.example.ui.viewmodel.CookbookViewModel(context)

    val scrollIndices = viewModel.getAlphabeticalScrollIndices()
    assert(scrollIndices.isNotEmpty())
    assertEquals(0, scrollIndices['A'])

    // Fast-scrolling index for 'A' must be 0
    assertEquals(0, viewModel.getLazyListIndexForLetter('A'))

    // Verify reverse mapping: index 0 should return 'A'
    assertEquals('A', viewModel.getLetterForScrollIndex(0))

    // Ensure all letter indices increase monotonically
    var prevIndex = -1
    for ((_, index) in scrollIndices) {
      assert(index > prevIndex) { "Index $index should be greater than $prevIndex" }
      prevIndex = index
    }
  }
}
