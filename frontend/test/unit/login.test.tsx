import { render, screen, fireEvent } from '@testing-library/react'
import LoginPage from '../../src/app/auth/login/page'

// Mock de lucide-react
jest.mock('lucide-react', () => ({
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
  Sun: () => <div data-testid="sun-icon" />,
  Moon: () => <div data-testid="moon-icon" />,
}))

// Mock de next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))

describe('LoginPage', () => {
  it('debe renderizar el título y los campos básicos', () => {
    render(<LoginPage />)
    
    expect(screen.getByText('CiteManager')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByText('Ingresar al Sistema')).toBeInTheDocument()
  })

  it('debe alternar la visibilidad de la contraseña al hacer clic en el botón del ojo', () => {
    render(<LoginPage />)
    
    const passwordInput = screen.getByLabelText('Contraseña')
    const toggleButton = screen.getByLabelText('Mostrar contraseña')
    
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText('Ocultar contraseña')).toBeInTheDocument()
    
    fireEvent.click(screen.getByLabelText('Ocultar contraseña'))
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('debe alternar el tema al hacer clic en el botón de tema', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')
    
    render(<LoginPage />)
    
    const themeButton = screen.getByLabelText('Cambiar tema')
    
    fireEvent.click(themeButton)
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'light')
  })
})
