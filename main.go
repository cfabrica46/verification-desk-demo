package main

import (
  "embed"
  "github.com/wailsapp/wails/v2"
  "github.com/wailsapp/wails/v2/pkg/options"
  "github.com/wailsapp/wails/v2/pkg/options/assetserver"
)
//go:embed all:frontend/dist
var assets embed.FS

func main() {
  app := NewApp()
  err := wails.Run(&options.App{
    Title:"Verification Desk", Width:900, Height:620,
    MinWidth:700, MinHeight:500,
    AssetServer:&assetserver.Options{Assets:assets},
    BackgroundColour:&options.RGBA{R:246,G:249,B:250,A:255},
    OnStartup:app.startup,
    Bind:[]interface{}{app},
  })
  if err != nil { println("Application error:",err.Error()) }
}
