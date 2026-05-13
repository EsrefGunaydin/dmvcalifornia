package com.dmvcalifornia.app.core.di

import android.content.Context
import android.content.SharedPreferences
import com.dmvcalifornia.app.core.util.Constants
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideSharedPreferences(
        @ApplicationContext context: Context
    ): SharedPreferences {
        return context.getSharedPreferences(Constants.Storage.PREFS_NAME, Context.MODE_PRIVATE)
    }
}
