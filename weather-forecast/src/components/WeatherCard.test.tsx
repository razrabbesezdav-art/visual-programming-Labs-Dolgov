import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import WeatherCard from './WeatherCard'
import { mockWeatherData } from '../mocks/weatherMock'

describe('WeatherCard', () => {
  it('отображает температуру корректно', () => {
    render(<WeatherCard day={mockWeatherData.daily[0]} />)
    expect(screen.getByText(/22°C/)).toBeInTheDocument()
  })

  it('отображает описание погоды', () => {
    render(<WeatherCard day={mockWeatherData.daily[0]} />)
    expect(screen.getByText(/ясно/i)).toBeInTheDocument()
  })

  it('отображает скорость ветра', () => {
    render(<WeatherCard day={mockWeatherData.daily[0]} />)
    expect(screen.getByText(/3.5 м\/с/)).toBeInTheDocument()
  })
})