export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex h-14 items-center justify-between text-sm text-muted-foreground">
        <span>
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-foreground">Aham Grham</span>. 
          Powered by Springreen
        </span>
        <span>
          Built with ❤️ for{" "}
          <span className="font-medium text-foreground">Aham Grham</span>
        </span>
      </div>
    </footer>
  )
}
