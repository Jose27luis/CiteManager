"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";
import styles from "./login.module.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <button className={`${styles.themeToggle} glass`} onClick={toggleTheme} aria-label="Cambiar tema">
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Hero Section con Logo 3D */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.logoWrapper}>
            <Image
              src="/auth/logo-login.jpg"
              alt="CiteManager Premium Logo"
              width={600}
              height={600}
              className={styles.logoImage}
              priority
            />
            <div className={styles.logoShadow}></div>
          </div>
          <div className={styles.heroText}>
            <h1>CiteManager</h1>
            <p>La evolución en la gestión inteligente de recursos hídricos.</p>
          </div>
        </div>
      </section>

      {/* Form Section Profesional */}
      <section className={styles.formSection}>
        <div className={`${styles.loginBox} glass animate-fade`}>
          <div className={styles.header}>
            <h2>Login</h2>
          </div>
          
          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Correo</label>
              <div className={styles.inputWrapper}>
                <input type="email" id="email" placeholder="" required />
              </div>
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password">Contraseña</label>
              <div className={styles.inputWrapper}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  placeholder="" 
                  required 
                />
                <button 
                  type="button" 
                  className={styles.eyeButton} 
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>
            
            <button type="submit" className={styles.submitBtn}>
              Ingresar al Sistema
            </button>
          </form>
          
          <div className={styles.footer}>
            <a href="#">¿Problemas para acceder? Contacta a soporte</a>
          </div>
        </div>
      </section>
    </div>
  );
}
