package com.dmvcalifornia.app.core.di

import com.dmvcalifornia.app.core.data.QuizDataSource
import com.dmvcalifornia.app.core.data.StorageManager
import com.dmvcalifornia.app.core.network.ApiClient
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DataModule {

    // QuizDataSource, StorageManager, and ApiClient are all provided
    // via @Inject constructor annotations (constructor injection).
    // This module exists for any future manual bindings.
}
