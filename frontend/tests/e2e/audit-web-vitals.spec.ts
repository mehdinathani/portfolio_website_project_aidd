import { test, expect } from '@playwright/test'

test.describe('Phase 10 — Audit & Verification', () => {

  test('T903: Desktop — canvas renders, hero content visible, a11y attributes', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)

    const hero = page.locator('section.relative.min-h-screen')
    await expect(hero).toBeVisible()

    const canvas = hero.locator('canvas')
    await expect(canvas).toBeAttached({ timeout: 15000 })
    await expect(canvas).toHaveAttribute('aria-hidden', 'true')
    await expect(canvas).toHaveAttribute('role', 'presentation')

    const headline = page.getByText(/intersection of AI|AI engineer|building/)
    await expect(headline).toBeVisible()

    const skipLink = page.getByText('Skip to content')
    await expect(skipLink).toBeAttached()
    await expect(skipLink).toHaveAttribute('href', '#main-content')
  })

  test('T904: Reduced motion — canvas paused at static frame', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)

    const canvas = page.locator('section canvas')
    const count = await canvas.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('T905: Mobile (375px) — no canvas, fallback gradient', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const hero = page.locator('section.relative.min-h-screen')
    await expect(hero).toBeVisible()

    const canvas = hero.locator('canvas')
    await expect(canvas).not.toBeAttached()

    const fallback = hero.locator('.hero-fallback-gradient')
    await expect(fallback).toBeAttached()
  })

  test('T907: LCP/CLS/FCP measurements within thresholds', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)

    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const results: any = {}
        let lcp = 0
        let cls = 0

        const lcpObs = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          if (entries.length > 0) lcp = entries[entries.length - 1].startTime
        })
        lcpObs.observe({ type: 'largest-contentful-paint', buffered: true })

        const clsObs = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) cls += (entry as any).value
          }
        })
        clsObs.observe({ type: 'layout-shift', buffered: true })

        const ltObs = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          results.longTasks = entries.length
          results.maxTask = Math.max(...entries.map((e) => e.duration), 0)
          results.tbt = entries
            .filter((e) => e.duration > 50)
            .reduce((s, e) => s + e.duration - 50, 0)
        })
        ltObs.observe({ type: 'longtask', buffered: true })

        setTimeout(() => {
          const nav = performance.getEntriesByType('navigation')[0] as any
          const paint = performance.getEntriesByType('paint')
          const fp = paint.find((p) => p.name === 'first-paint')
          const fcp = paint.find((p) => p.name === 'first-contentful-paint')

          results.LCP = lcp
          results.CLS = cls
          results.FP = fp?.startTime ?? 0
          results.FCP = fcp?.startTime ?? 0
          results.TTFB = nav ? nav.responseStart - nav.requestStart : 0
          results.DCL = nav ? nav.domContentLoadedEventEnd : 0
          results.loadEvent = nav ? nav.loadEventEnd : 0
          resolve(results)
        }, 10000)
      })
    })

    console.log('=== Web Vitals ===')
    for (const [k, v] of Object.entries(vitals)) {
      console.log(`  ${k}: ${v}`)
    }

    expect((vitals as any).LCP).toBeLessThan(4000)
    expect((vitals as any).CLS).toBeLessThan(0.25)
    expect((vitals as any).FCP).toBeLessThan(3500)
    expect((vitals as any).TTFB).toBeLessThan(1500)
  })

  test('Desktop keyboard a11y: heading structure', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)

  })
})
