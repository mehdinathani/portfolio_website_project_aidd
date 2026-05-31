import { test, expect } from '@playwright/test'

test.describe('Hero Shader (US7)', () => {

  test('desktop viewport: canvas renders with shader hero', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    const hero = page.locator('section.relative.min-h-screen')
    await expect(hero).toBeVisible()

    const canvas = hero.locator('canvas')
    await expect(canvas).toBeAttached({ timeout: 15000 })
  })

  test('mobile viewport (375px): no canvas, fallback renders', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const hero = page.locator('section.relative.min-h-screen')
    await expect(hero).toBeVisible()

    const canvas = hero.locator('canvas')
    await expect(canvas).not.toBeAttached()

    const fallback = hero.locator('.hero-fallback-gradient')
    await expect(fallback).toBeAttached()
  })

  test('hero content renders (H1 + CTAs)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    const headline = page.getByText(/intersection of AI/)
    await expect(headline).toBeVisible()

    const bookCall = page.getByRole('link', { name: /Book a call/ }).first()
    await expect(bookCall).toBeVisible()

    const viewProjects = page.getByRole('link', { name: /View Projects/ })
    await expect(viewProjects).toBeVisible()
  })

  test('skip-to-content link exists and is accessible', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    const skipLink = page.getByText('Skip to content')
    await expect(skipLink).toBeAttached()
    await expect(skipLink).toHaveAttribute('href', '#main-content')
  })

  test('hero CTA links are reachable', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    const viewProjects = page.getByRole('link', { name: /View Projects/ })
    await expect(viewProjects).toBeVisible()
    await expect(viewProjects).toHaveAttribute('href', '/projects')
  })
})
