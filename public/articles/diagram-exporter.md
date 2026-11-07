# Diagram Exporter

Python desktop tool for toroidal transformer manufacturing docs. Built during the Noratel internship to replace hand-drawn schematics and copy-paste Excel packs.

An engineer picks a design from the factory database. The app draws the schematic (primary and secondary windings, phase dots, thermal switches) and fills a winding table. After the layout is right, one export writes a multi-sheet `.xlsx` pack from the same data.

Repo: [diagram-design-tool](https://github.com/ashen-v2/diagram-design-tool). Full MkDocs set lives in `DiagramExporterDocs/`.

## What it automates

| Step | What happens |
| --- | --- |
| Load | Refresh pulls designs from SQL Server. Search by design name, file name, or designer. |
| Draw | Selecting a design paints the canvas and fills Tab 2 with winding rows. |
| Edit | Double-click cells for color, length, AWG, wire count, tube type, and tube length. The canvas redraws as those values change. |
| Tubes | The tube tree lists compatible tubes from wire count, gauge, and style. |
| Layout | Add primary/secondary boxes, phase dots, and thermal switches. Middle-drag to move, right-click to delete, marquee for group actions. |
| Export | PNG of the canvas, or a full Excel report with the diagram baked in. |

Winding edits redraw the canvas and wipe manual placement. Finalize Tab 2 first, then nudge the layout, then export.

## Architecture

The GUI and the Excel engine are separate on purpose. The canvas can run without Excel; the engine can run if it is given the diagram image, winding rows, and a design id.

```text
Engineer
  → GUI (mainoop.py, canvasutils.py, utils.py)
      → SQL Server (Design, Windings, Core, BOM)
      → PNG of the schematic
  → Excel engine (main.py)
      → template workbook
      → BOM prices, wire/copper CSVs
      → .xlsx (design, control plan, BOM, production, time, front page)
```

`dbconfig.py` is the database API (`connect_db`, `extract_design_details`, `extract_core_details`, `extract_bom_details`). `utils.excel_save()` packages GUI state for `main.py`.

The engine opens the template and the BOM price book, pulls core/design/BOM rows, enriches the BOM, then fills sheets. Older helpers live in `temp1/` (`insert.py` and sheet utilities). Newer class-based writers live in `temp2/` (`WindTable`, `BomUtils`, `TimeSheet`, `FrontPage`). `save_workbook()` writes the file.

## Data

| Source | Role |
| --- | --- |
| `dbo.Design` | Design number, file name, user |
| `dbo.Windings` | Electrical and wire specs per winding |
| `dbo.Core` | Core size, material, insulation |
| `dbo.BOM` | Quantities and units for copper, wire, steel, insulation |
| `tubedata/` | Tube catalog and wire-to-tube map for the GUI |
| `wires/` | Lead-wire and copper size lookups for Excel |
| `bom/BOMtest.xlsm` | Component prices |
| `template/testcopy6.xlsx` | Report layout |

Logs go to `app.log`. Failures are recorded there and shown in a Tk message box.

## Stack

| Piece | Role |
| --- | --- |
| Python 3.8+ | App |
| CustomTkinter | Desktop UI |
| Pillow | Canvas capture |
| pyodbc | SQL Server |
| openpyxl | Excel fill |
| PyInstaller | Packaged `.exe` for the shop floor |
