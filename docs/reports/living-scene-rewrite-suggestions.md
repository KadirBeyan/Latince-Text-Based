# Living Scene Rewrite Suggestions Report

This report outlines scenes in Via Prima that are currently legacy Q&A or choices scenes and recommends how they can be migrated to the new interaction-loop and living scene model.

## Chapter: Bibliotheca

### Scene: `bibliotheca_002_practice` - *Bibliotheca 002*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_002_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_002_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_003_voice` - *Bibliotheca 003*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_003_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_003_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_004_reply` - *Bibliotheca 004*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_004_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_004_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_005_review` - *Bibliotheca 005*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_005_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_005_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_006_path` - *Bibliotheca 006*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_006_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_006_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_007_arrival` - *Bibliotheca 007*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_007_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_007_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_008_practice` - *Bibliotheca 008*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_008_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_008_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_009_voice` - *Bibliotheca 009*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_009_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_009_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_010_reply` - *Bibliotheca 010*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_010_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_010_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_011_review` - *Bibliotheca 011*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_011_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_011_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_012_path` - *Bibliotheca 012*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_012_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_012_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_013_arrival` - *Bibliotheca 013*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_013_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_013_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_014_practice` - *Bibliotheca 014*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_014_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_014_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_015_voice` - *Bibliotheca 015*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_015_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_015_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_016_reply` - *Bibliotheca 016*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_016_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_016_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_017_review` - *Bibliotheca 017*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_017_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_017_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_018_path` - *Bibliotheca 018*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_018_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_018_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_019_arrival` - *Bibliotheca 019*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_019_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_019_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_020_practice` - *Bibliotheca 020*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_020_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_020_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_021_voice` - *Bibliotheca 021*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_021_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_021_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_022_reply` - *Bibliotheca 022*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_022_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_022_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_023_review` - *Bibliotheca 023*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_023_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_023_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_024_path` - *Bibliotheca 024*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_024_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_024_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `bibliotheca_025_arrival` - *Bibliotheca 025*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "bibliotheca_025_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "bibliotheca_025_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

## Chapter: Capitolium

### Scene: `capitolium_001_arrival` - *Capitolium 001*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_001_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_001_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_002_practice` - *Capitolium 002*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_002_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_002_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_003_voice` - *Capitolium 003*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_003_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_003_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_004_reply` - *Capitolium 004*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_004_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_004_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_005_review` - *Capitolium 005*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_005_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_005_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_006_path` - *Capitolium 006*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_006_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_006_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_007_arrival` - *Capitolium 007*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_007_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_007_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_008_practice` - *Capitolium 008*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_008_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_008_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_009_voice` - *Capitolium 009*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_009_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_009_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_010_reply` - *Capitolium 010*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_010_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_010_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_011_review` - *Capitolium 011*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_011_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_011_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_012_path` - *Capitolium 012*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_012_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_012_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_013_arrival` - *Capitolium 013*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_013_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_013_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_014_practice` - *Capitolium 014*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_014_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_014_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_015_voice` - *Capitolium 015*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_015_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_015_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_016_reply` - *Capitolium 016*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_016_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_016_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_017_review` - *Capitolium 017*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_017_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_017_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_018_path` - *Capitolium 018*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_018_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_018_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_019_arrival` - *Capitolium 019*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_019_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_019_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_020_practice` - *Capitolium 020*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_020_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_020_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_021_voice` - *Capitolium 021*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_021_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_021_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_022_reply` - *Capitolium 022*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_022_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_022_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_023_review` - *Capitolium 023*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_023_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_023_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_024_path` - *Capitolium 024*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_024_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_024_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_025_arrival` - *Capitolium 025*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_025_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_025_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_026_practice` - *Capitolium 026*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_026_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_026_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_027_voice` - *Capitolium 027*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_027_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_027_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_028_reply` - *Capitolium 028*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_028_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_028_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_029_review` - *Capitolium 029*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_029_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_029_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `capitolium_030_path` - *Capitolium 030*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "capitolium_030_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "capitolium_030_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

## Chapter: Castra

### Scene: `castra_002_practice` - *Castra 002*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_002_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_002_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_003_voice` - *Castra 003*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_003_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_003_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_004_reply` - *Castra 004*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_004_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_004_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_005_review` - *Castra 005*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_005_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_005_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_006_path` - *Castra 006*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_006_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_006_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_007_arrival` - *Castra 007*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_007_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_007_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_008_practice` - *Castra 008*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_008_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_008_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_009_voice` - *Castra 009*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_009_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_009_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_010_reply` - *Castra 010*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_010_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_010_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_011_review` - *Castra 011*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_011_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_011_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_012_path` - *Castra 012*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_012_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_012_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_013_arrival` - *Castra 013*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_013_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_013_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_014_practice` - *Castra 014*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_014_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_014_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_015_voice` - *Castra 015*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_015_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_015_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_016_reply` - *Castra 016*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_016_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_016_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_017_review` - *Castra 017*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_017_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_017_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_018_path` - *Castra 018*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_018_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_018_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_019_arrival` - *Castra 019*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_019_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_019_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_020_practice` - *Castra 020*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_020_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_020_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_021_voice` - *Castra 021*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_021_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_021_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_022_reply` - *Castra 022*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_022_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_022_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_023_review` - *Castra 023*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_023_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_023_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_024_path` - *Castra 024*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_024_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_024_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `castra_025_arrival` - *Castra 025*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "castra_025_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "castra_025_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

## Chapter: Domus

### Scene: `domus_002_practice` - *Domus 002*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_002_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_002_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_003_voice` - *Domus 003*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_003_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_003_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_004_reply` - *Domus 004*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_004_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_004_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_005_review` - *Domus 005*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_005_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_005_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_006_path` - *Domus 006*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_006_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_006_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_007_arrival` - *Domus 007*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_007_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_007_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_008_practice` - *Domus 008*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_008_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_008_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_009_voice` - *Domus 009*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_009_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_009_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_010_reply` - *Domus 010*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_010_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_010_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_011_review` - *Domus 011*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_011_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_011_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_012_path` - *Domus 012*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_012_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_012_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_013_arrival` - *Domus 013*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_013_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_013_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_014_practice` - *Domus 014*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_014_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_014_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_015_voice` - *Domus 015*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_015_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_015_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_016_reply` - *Domus 016*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_016_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_016_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_017_review` - *Domus 017*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_017_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_017_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_018_path` - *Domus 018*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_018_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_018_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_019_arrival` - *Domus 019*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_019_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_019_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_020_practice` - *Domus 020*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_020_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_020_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_021_voice` - *Domus 021*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_021_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_021_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_022_reply` - *Domus 022*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_022_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_022_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_023_review` - *Domus 023*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_023_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_023_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_024_path` - *Domus 024*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_024_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_024_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `domus_025_arrival` - *Domus 025*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "domus_025_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "domus_025_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

## Chapter: Forum

### Scene: `forum_002_practice` - *Forum 002*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_002_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_002_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_003_voice` - *Forum 003*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_003_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_003_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_004_reply` - *Forum 004*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_004_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_004_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_005_review` - *Forum 005*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_005_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_005_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_006_path` - *Forum 006*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_006_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_006_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_007_arrival` - *Forum 007*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_007_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_007_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_008_practice` - *Forum 008*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_008_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_008_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_009_voice` - *Forum 009*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_009_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_009_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_010_reply` - *Forum 010*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_010_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_010_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_011_review` - *Forum 011*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_011_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_011_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_012_path` - *Forum 012*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_012_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_012_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_013_arrival` - *Forum 013*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_013_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_013_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_014_practice` - *Forum 014*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_014_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_014_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_015_voice` - *Forum 015*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_015_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_015_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_016_reply` - *Forum 016*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_016_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_016_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_017_review` - *Forum 017*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_017_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_017_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_018_path` - *Forum 018*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_018_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_018_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_019_arrival` - *Forum 019*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_019_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_019_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_020_practice` - *Forum 020*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_020_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_020_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_021_voice` - *Forum 021*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_021_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_021_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_022_reply` - *Forum 022*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_022_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_022_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_023_review` - *Forum 023*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_023_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_023_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_024_path` - *Forum 024*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_024_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_024_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_025_arrival` - *Forum 025*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_025_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_025_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_026_practice` - *Forum 026*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_026_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_026_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_027_voice` - *Forum 027*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_027_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_027_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_028_reply` - *Forum 028*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_028_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_028_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_029_review` - *Forum 029*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_029_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_029_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `forum_030_path` - *Forum 030*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "forum_030_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "forum_030_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

## Chapter: Ludus

### Scene: `ludus_001_arrival` - *Ludus 001*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_001_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_001_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_002_practice` - *Ludus 002*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_002_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_002_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_003_voice` - *Ludus 003*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_003_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_003_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_004_reply` - *Ludus 004*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_004_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_004_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_005_review` - *Ludus 005*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_005_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_005_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_006_path` - *Ludus 006*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_006_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_006_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_007_arrival` - *Ludus 007*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_007_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_007_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_008_practice` - *Ludus 008*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_008_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_008_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_009_voice` - *Ludus 009*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_009_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_009_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_010_reply` - *Ludus 010*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_010_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_010_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_011_review` - *Ludus 011*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_011_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_011_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_012_path` - *Ludus 012*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_012_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_012_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_013_arrival` - *Ludus 013*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_013_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_013_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_014_practice` - *Ludus 014*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_014_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_014_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_015_voice` - *Ludus 015*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_015_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_015_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_016_reply` - *Ludus 016*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_016_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_016_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_017_review` - *Ludus 017*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_017_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_017_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_018_path` - *Ludus 018*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_018_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_018_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_019_arrival` - *Ludus 019*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_019_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_019_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_020_practice` - *Ludus 020*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_020_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_020_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_021_voice` - *Ludus 021*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_021_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_021_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_022_reply` - *Ludus 022*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_022_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_022_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_023_review` - *Ludus 023*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_023_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_023_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_024_path` - *Ludus 024*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_024_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_024_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `ludus_025_arrival` - *Ludus 025*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "ludus_025_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "ludus_025_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

## Chapter: Prologus

### Scene: `meet_magister` - *Magister Aelius*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "meet_magister_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "meet_magister", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `choose_tablet` - *Wax and Stylus*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "choose_tablet_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "choose_tablet", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `first_latin_question` - *The First Answer*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "first_latin_question_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "first_latin_question", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `lesson_complete` - *Lesson Complete*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "lesson_complete_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "lesson_complete", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_001_arrival` - *Prologus 001*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_001_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_001_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_002_practice` - *Prologus 002*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_002_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_002_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_003_voice` - *Prologus 003*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_003_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_003_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_004_reply` - *Prologus 004*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_004_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_004_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_005_review` - *Prologus 005*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_005_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_005_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_006_path` - *Prologus 006*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_006_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_006_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_007_arrival` - *Prologus 007*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_007_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_007_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_008_practice` - *Prologus 008*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_008_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_008_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_009_voice` - *Prologus 009*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_009_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_009_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_010_reply` - *Prologus 010*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_010_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_010_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_011_review` - *Prologus 011*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_011_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_011_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_012_path` - *Prologus 012*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_012_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_012_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_013_arrival` - *Prologus 013*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_013_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_013_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_014_practice` - *Prologus 014*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_014_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_014_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_015_voice` - *Prologus 015*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_015_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_015_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_016_reply` - *Prologus 016*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_016_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_016_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_017_review` - *Prologus 017*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_017_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_017_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_018_path` - *Prologus 018*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_018_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_018_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_019_arrival` - *Prologus 019*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_019_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_019_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `prologus_020_practice` - *Prologus 020*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "prologus_020_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "prologus_020_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

## Chapter: Via Appia

### Scene: `via-appia_001_arrival` - *Via Appia 001*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_001_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_001_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_002_practice` - *Via Appia 002*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_002_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_002_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_003_voice` - *Via Appia 003*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_003_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_003_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_004_reply` - *Via Appia 004*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_004_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_004_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_005_review` - *Via Appia 005*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_005_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_005_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_006_path` - *Via Appia 006*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_006_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_006_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_007_arrival` - *Via Appia 007*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_007_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_007_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_008_practice` - *Via Appia 008*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_008_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_008_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_009_voice` - *Via Appia 009*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_009_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_009_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_010_reply` - *Via Appia 010*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_010_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_010_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_011_review` - *Via Appia 011*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_011_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_011_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_012_path` - *Via Appia 012*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_012_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_012_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_013_arrival` - *Via Appia 013*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_013_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_013_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_014_practice` - *Via Appia 014*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_014_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_014_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_015_voice` - *Via Appia 015*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_015_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_015_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_016_reply` - *Via Appia 016*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_016_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_016_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_017_review` - *Via Appia 017*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_017_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_017_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_018_path` - *Via Appia 018*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_018_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_018_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_019_arrival` - *Via Appia 019*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_019_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_019_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_020_practice` - *Via Appia 020*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_020_practice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_020_practice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_021_voice` - *Via Appia 021*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_021_voice_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_021_voice", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_022_reply` - *Via Appia 022*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_022_reply_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_022_reply", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_023_review` - *Via Appia 023*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_023_review_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_023_review", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_024_path` - *Via Appia 024*
- **Current Input Mode**: `dialogue-response`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_024_path_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_024_path", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

### Scene: `via-appia_025_arrival` - *Via Appia 025*
- **Current Input Mode**: `choice`
- **Suggested Action**: Convert to `interaction-loop` or add living scene components.
- **Recommendations**:
  - Add `ambientTemplates`: `["inspect_object", "remember_lesson"]` to encourage environmental investigation.
  - Add a `revisitVariants` block to change description when visiting again. E.g.:
    ```json
    "revisitVariants": [
      {
        "id": "via-appia_025_arrival_revisit",
        "conditions": [
          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "via-appia_025_arrival", "count": 2 }
        ],
        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."
      }
    ]
    ```

