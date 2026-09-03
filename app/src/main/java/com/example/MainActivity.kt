package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import com.example.ui.MainAppScreen
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.viewmodel.CookbookViewModel
import com.example.ui.viewmodel.CookbookViewModelFactory

class MainActivity : ComponentActivity() {

  private val viewModel: CookbookViewModel by viewModels {
    CookbookViewModelFactory(application)
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      MyApplicationTheme {
        MainAppScreen(viewModel = viewModel)
      }
    }
  }
}
