# VerseCraft - AI Poetry Tutor

VerseCraft is a sophisticated web application designed to help poets refine their craft. It combines real-time structural validation (syllable counting, rhyme schemes) with deep, qualitative feedback powered by Google's Gemini API.
<img width="900" height="400" alt="Screenshot 2025-12-12 085750" src="https://github.com/user-attachments/assets/4a9106d7-3110-4a20-8df5-5a749f983106" />



## 🎭 What It Is
VerseCraft is a **tutor**, not a generator.
*   **Structured Environment:** A clean, distraction-free editor with a "Gutter" that validates line counts and syllables in real-time.
*   **Pedagogical AI:** It uses the **RBFR** (Role, Behaviour, Function, Reporting) and **SSPSS** (State, Support, Problem, Solve, Summarize) frameworks to act as a literary editor.
*   **Form Specific:** It understands the constraints of Haikus, Sonnets, Limericks, and Villanelles.

<img width="350" height="350" alt="Screenshot 2025-12-12 085835" src="https://github.com/user-attachments/assets/4f3175bd-4303-4122-bd3f-1ae1d18c08ec" />


## 🚫 What It Is Not
*   **Not a Poem Generator:** It will not write the poem for you (though it may offer a small revision example to demonstrate a specific technique).
*   **Not a Spellchecker:** While it catches basic errors, its primary focus is on meter, imagery, and emotional impact.

## 🚀 How to Run (npm)

This project was built with React and Vite.

### Prerequisites
*   Node.js (v18 or higher recommended)
*   A Google Cloud Project with the Gemini API enabled.
*   An API Key for Gemini.

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/versecraft.git
    cd versecraft
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  **Configure API Key:**
    *   Create a `.env` file in the root directory.
    *   Add your Gemini API key:
        ```env
        API_KEY=your_actual_google_api_key_here
        ```
    *   *Note: In a production web environment, this key would typically be proxied via a backend to prevent exposure, or you would use the `dangerouslyAllowBrowser` option if strictly for local testing/prototyping.*

4.  Start the development server:
    ```bash
    npm run dev
    ```

5.  Open your browser to the local host link provided (usually `http://localhost:5173`).

## 🧠 Importing to Google AI Studio

You cannot "import" the entire React application into Google AI Studio, as AI Studio is an interface for prompt engineering and model tuning. However, you can import the **System Instructions** and **Schema** to test and refine the persona used by VerseCraft.

### Steps to Replicate the Persona in AI Studio:

1.  Open [Google AI Studio](https://aistudio.google.com/).
2.  Create a new **Chat Prompt**.
3.  **Model Selection:** Select `Gemini 2.0 Flash` (or 1.5 Pro).
4.  **System Instructions:**
    *   Open `constants.ts` in this project.
    *   Copy the content of the `SYSTEM_INSTRUCTION` constant.
    *   Paste this into the "System Instructions" block in AI Studio.
5.  **JSON Mode (Schema):**
    *   In the model settings (right sidebar), enable **JSON Mode**.
    *   Open `services/geminiService.ts`.
    *   Copy the structure of `analysisSchema`.
    *   Paste this as the schema definition in AI Studio.
6.  **Testing:**
    *   In the user input area, simulate the API call:
        ```text
        Please act as the Poetry Editor. The user is writing a poem in the style of: Haiku.
        Here is the poem:
        "Leaves falling down / onto the cold wet ground now / winter is coming"
        ```
    *   Run the prompt to see how the model behaves using the specific SSPSS framework defined in the system instructions.

## 🛠️ Tech Stack
*   **Frontend:** React 19, TypeScript, TailwindCSS.
*   **AI:** `@google/genai` SDK (Gemini 2.5 Flash).
*   **Icons:** Lucide React.
*   **Fonts:** Inter (UI) and Cormorant Garamond (Editor).

## 📄 License
MIT
