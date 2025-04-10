This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where comments have been removed, empty lines have been removed, content has been compressed (code blocks are separated by ⋮---- delimiter).

# Directory Structure
```
src/
  app/
    (auth)/
      admin/
        actions.ts
        page.tsx
      sign-in/
        [[...sign-in]]/
          page.tsx
      sign-up/
        [[...sign-up]]/
          page.tsx
    (site)/
      explore/
        disclosure/
          loading.tsx
          page.tsx
        event/
          [id]/
            page.tsx
        key-figures/
          components/
            whos-who-gallery.tsx
          page.tsx
        topic/
          [id]/
            page.tsx
        visualizations/
          3d-grid/
            page.tsx
          drawing-board/
            page.tsx
          word-cloud/
            page.tsx
        layout.tsx
        loading.tsx
        page.tsx
      history/
        events/
          [id]/
            page.tsx
          page.tsx
        gallery/
          page.tsx
        page.tsx
      sightings/
        realtime/
          error.tsx
          loading.tsx
          page.tsx
        page.tsx
        sightings-analytics.tsx
      timeline/
        page.tsx
        timeline-views.tsx
    api/
      admin/
        test-ranking-system/
          route.ts
        trigger-ranking-update/
          route.ts
      chat/
        route.ts
      cron/
        update-rankings/
          route.ts
      disclosure/
        chat/
          demo.ts
          route-demo.ts
          route.ts
        data-layer/
          aggregate/
            route.ts
          ask/
            route.ts
          backup/
            route.ts
          enrich/
            route.ts
          scrape/
            batch/
              route.ts
            route.ts
          search/
            connections/
              route.ts
            table/
              route.ts
          sightings/
            route.ts
        knowledge-layer/
          process/
            route.ts
          vector-store/
            files/
              [fileId]/
                route.ts
              list/
                route.ts
        process-resource/
          route.ts
      internal/
        export/
          route.ts
        key-figures/
          route.ts
        uap-sightings/
          route.ts
      sse/
        test/
          route.ts
        xata/
          ask/
            send/
              route.ts
            route.ts
            shared.ts
            utils.ts
      test-xata/
        route.ts
      workflow/
        execute/
          route.ts
    fonts.tsx
    layout.tsx
    loading.tsx
    page.tsx
  components/
    9-ui/
      toolbar.tsx
    animated-workflow/
      animated-workflow.tsx
    app-sidebar/
      AppSidebar.tsx
      index.tsx
    backgrounds/
      animated-grid-pattern/
        AnimatedGridPattern.tsx
        index.tsx
      background-static/
        BackgroundStatic.tsx
        index.tsx
      dot-gradient/
        dot-gradient.tsx
      graph-paper/
        graph-paper-bg.tsx
        index.tsx
      matrix-background/
        index.tsx
        MatrixBackground.tsx
      shooting-stars/
        index.tsx
        shooting-stars-background.tsx
        ShootingStars.tsx
        stars-background.tsx
      backgrounds.tsx
      dot-grid-background.tsx
      dot-pattern.tsx
      grain.tsx
      grid-background.tsx
      index.tsx
      meteors.tsx
      shader-bg.tsx
      stars-background.tsx
    blockquote/
      Blockquote.tsx
      index.tsx
    blocks/
      DropdownCard.tsx
      LinkCardGrid.tsx
      LinkCards.tsx
    bottom-drawer/
      BottomDrawer.stories.tsx
      BottomDrawer.tsx
      index.tsx
    cult-ui/
      expandable-card/
        card.tsx
        expandable.tsx
      floating-panel/
        floating-panel.tsx
        index.tsx
      popover/
        index.tsx
        popover.tsx
      sortable-list/
        index.tsx
        SortableList.tsx
      index.tsx
    cursors/
      index.tsx
      mindmap-cursor.tsx
      neon-cursor.tsx
    decorative/
      rulers/
        ruler-ticks.tsx
    dock/
      Card/
        index.tsx
        styles.module.scss
      Dock/
        DockContext.ts
        index.tsx
        styles.module.scss
      DockCard/
        index.tsx
        styles.module.scss
      DockDivider/
        index.tsx
        styles.module.scss
      hooks/
        useCallbackRef.ts
        useMousePosition.ts
        useWindowResize.ts
      index.tsx
    draggable-stack/
      DraggableStack.tsx
      index.tsx
    drawers/
      drawer-underlay.stories.tsx
      drawer-underlay.tsx
    earth/
      Earth.tsx
      index.tsx
    file-upload/
      index.tsx
    glitch-fx/
      GlitchFx.stories.tsx
      GlitchFx.tsx
      index.tsx
    globe/
      Globe.tsx
      GlobePointsRenderer.tsx
    globes/
      cobe-globes/
        admin-dashboard-globe.tsx
        alt-globe.tsx
        artifact-sphere-animation.tsx
        cobe-globe.tsx
        globe-light.svg
        globe.svg
        index.tsx
      index.tsx
      mapbox-globe.tsx
      threejs-globe.tsx
    graph-paper/
      graph-paper.stories.tsx
      GraphPaper.tsx
      index.tsx
      main.js
    GridAnimation/
      GridAnimation.tsx
      index.ts
    hud-interface/
      AnimatedHudInterface.tsx
      CardsPlayerHolo.stories.tsx
      CardsPlayerHolo.tsx
      CardsPlayerHolo2.stories.tsx
      CardsPlayerHolo2.tsx
      CirclesHud.tsx
      CirclesHud2.stories.tsx
      CirclesHud2.tsx
      CirclesHud3.stories.tsx
      CirclesHud3.tsx
      Dashboard1.stories.tsx
      Dashboard1.tsx
      Dashboard2.stories.tsx
      Dashboard2.tsx
      GlitchySurveillanceUi.tsx
      HudCard.stories.tsx
      HudCard.tsx
      HudCard2.stories.tsx
      HudCard2.tsx
      HudDash.animations.tsx
      HudDash.stories.tsx
      HudDash.tsx
      HudInterface.tsx
      index.tsx
      SpaceCard.stories.tsx
      SpaceCard.tsx
      TextScrambleEffect.tsx
    loaders/
      index.tsx
      loading.tsx
      sightings-loader.tsx
    location-visualization/
      index.tsx
      LocationVisualization.tsx
    loggers/
      render-logger.tsx
    moon/
      index.tsx
      Moon.tsx
    multistep-loader/
      index.tsx
      multistep-loader.stories.ts
      multistep-loader.tsx
    navbar/
      full-site-nav.tsx
      index.tsx
      navbar.tsx
      ut-logo-alt.tsx
      ut-logo.tsx
    note/
      AddNote.tsx
      AddNoteFloatingPanel.tsx
      AddNotePopover.tsx
      index.tsx
    reactbits/
      AnimatedContent/
        AnimatedContent.tsx
      Carousel/
        Carousel.tsx
      InfiniteMenu/
        InfiniteMenu.tsx
      true-focus-cursor/
        index.tsx
    sci-fi/
      footer/
        footer.tsx
      arrow-ui.tsx
      brain-comparison.tsx
      brain-scanner.tsx
      brain-visualization.tsx
      engineer.tsx
      file-stack-demo.tsx
      holographic-file-stack.tsx
      index.ts
      minimal-vertical-menu.tsx
      skull-scan.tsx
    sci-fi-hud/
      canvas-background.tsx
      comparison.tsx
      right-ui.tsx
      scan.tsx
      scanner.tsx
      side-ui.tsx
      view-labels.tsx
      visualization.tsx
    search/
      animated-search-input.tsx
      index.tsx
      search-input.tsx
    shader/
      index.tsx
      shader.tsx
    side-panel/
      side-panel.tsx
    sightings/
      sightings-ai-insights.tsx
    tabs/
      index.tsx
      tabs.stories.ts
      tabs.tsx
    timeline-roadmap/
      index.tsx
    timelines/
      3d-timeline/
        index.tsx
        ThreeDTimeline.stories.tsx
        ThreeDTimeline.tsx
        ThreeDTimelineExample.tsx
      draggable-timeline/
        data/
          items.ts
        draggable-timeline.stories.tsx
        draggable-timeline.tsx
        index.tsx
        Section.tsx
      scroll-through-timeline/
        scroll-through-timeline.tsx
      timeline/
        index.tsx
        Timeline.stories.tsx
        Timeline.tsx
        TimelineExample.tsx
      index.tsx
    toolbars/
      dynamic-toolbar/
        DynamicToolbar.stories.tsx
        DynamicToolbar.tsx
        index.tsx
      mini-toolbar/
        index.tsx
        MiniToolbar.stories.tsx
        MiniToolbar.tsx
      animated-toolbar.stories.tsx
      animated-toolbar.tsx
      index.tsx
      ModelActionToolbar.tsx
      motion-dynamic-toolbar.tsx
      toolbar-expandable.stories.tsx
      toolbar-expandable.tsx
      transition-panel.tsx
      ui-lab-toolbar.stories.tsx
      ui-lab-toolbar.tsx
    ufo/
      UFO.tsx
    ui/
      button/
        delete-button/
          DeleteButton.tsx
          index.tsx
        divider-buttons/
          divider-button.stories.tsx
          divider-button.tsx
          index.ts
        animated-button.tsx
        animated-menu-button.tsx
        button.tsx
        create-button.tsx
        index.tsx
        share-button.tsx
        shiny-button.tsx
      canvas-cursor/
        blob-cursor.tsx
        canvas-cursor.tsx
        index.tsx
      card/
        bento/
          bento-cards.tsx
          bento-grid.tsx
          index.tsx
        card-stack/
          card-stack.tsx
          index.tsx
        data-card/
          data-card.tsx
        expandable-card/
          ExpandableCardGridLayout.tsx
          ExpandableCardStandardLayout.tsx
          index.tsx
        hover-card/
          hover-card.stories.ts
          hover-card.tsx
          index.tsx
        list-card/
          index.tsx
          list-card.tsx
        pill-card/
          index.tsx
          PillCard.tsx
        background-overlay-card.tsx
        card.tsx
        expandable-card.tsx
        ExpandableCard.tsx
        graph-node-card.tsx
        grid-layout-examples.tsx
        grid-layout.tsx
        hover-card.tsx
        index.tsx
        pill-card.tsx
        shift-card-demo.tsx
        shift-card.tsx
        simple-card.tsx
        stars-card.tsx
        text-reveal-card.tsx
        toggle-entity-input-with-search.tsx
      chat/
        chat-bubble.tsx
        chat-input.tsx
        chat-message-area.tsx
        chat-message-list.tsx
        chat-message.tsx
        expandable-chat.tsx
        index.tsx
        markdown-content.tsx
        message-loading.tsx
        scroll-area.tsx
      command/
        command-mind-map-menu.tsx
        command-search-menu.tsx
      direction-aware-tabs/
        direction-aware-tabs.tsx
        index.tsx
      header/
        site-header.tsx
      icons/
        arrow.tsx
        index.tsx
        openai.tsx
      kibo-ui/
        pill/
          index.tsx
      loading/
        globe-loading.tsx
      tooltip/
        animated-tooltip.tsx
        index.tsx
        tooltip.tsx
      accordion.tsx
      alert-dialog.tsx
      alert.tsx
      aspect-ratio.tsx
      avatar.tsx
      badge.tsx
      breadcrumb.tsx
      calendar.tsx
      card.tsx
      carousel.tsx
      chart.tsx
      checkbox.tsx
      collapsible.tsx
      command.tsx
      context-menu.tsx
      dialog.tsx
      dock.tsx
      drawer.tsx
      dropdown-menu.tsx
      expandable-card.tsx
      form.tsx
      gradient-tracing.tsx
      hover-card.tsx
      index.ui.tsx
      input-otp.tsx
      input.tsx
      jsx-preview.tsx
      label.tsx
      markdown.tsx
      menubar.tsx
      navigation-menu.tsx
      pagination.tsx
      popover.tsx
      progress.tsx
      radio-group.tsx
      resizable.tsx
      scroll-area.tsx
      select.tsx
      separator.tsx
      services-grid.tsx
      sheet.tsx
      sidebar.tsx
      skeleton.tsx
      slider.tsx
      sonner.tsx
      switch.tsx
      table.tsx
      tabs.tsx
      textarea.tsx
      toggle-group.tsx
      toggle.tsx
      tooltip.tsx
    vertical-progress-ui/
      index.tsx
      VerticalProgressUi.tsx
    video/
      index.tsx
      video.tsx
    animated-svg-edge.tsx
    annotation-node.tsx
    chat-sidebar.tsx
    data-edge.tsx
    DeployButton.tsx
    dotted-dialog.tsx
    grid-background.tsx
    grid-overlay.tsx
    hero.tsx
    MastraHomepageHero.tsx
    terminal-display.tsx
    test.tsx
    web-vitals.tsx
  contexts/
    ai/
      ai-context.tsx
      ai-reducer.tsx
    mindmap/
      index.tsx
      mindmap-context.tsx
      mindmap.interface.ts
    floating-context.tsx
    index.tsx
    location-provider.tsx
    state-of-disclosure-provider.tsx
    theme-provider.tsx
  db/
    xata/
      db/
        fetch-paginated-records.ts
        models.ts
        search-operations.ts
      client.ts
      index.ts
      xata.ts
  features/
    3d/
      3d-card/
        3d-card.tsx
      3d-pin/
        3d-pin-card.tsx
        3d-pin.stories.ts
        3d-pin.tsx
        index.tsx
      3d-timeline-journey/
        config/
          assetData.ts
          assetOrder.ts
          index.ts
          months.ts
        shaders/
          default.vert
          greenscreen.frag
          item.frag
        stories/
          3d-timeline-journey.stories.ts
          data.ts
        utils/
          progressPromise.ts
          useAssetLoader.tsx
        3d-timeline-journey.tsx
        index.tsx
        item.tsx
        section.tsx
        timeline.tsx
      dna-visualization/
        DnaPage.tsx
        DnaVisualization.stories.tsx
        DnaVisualization.tsx
        index.ts
      drawing-board/
        command-menu.tsx
        drawing-board__d3.tsx
        drawing-board.tsx
        entity-menu.tsx
        graph.tsx
        index.tsx
        nodes.tsx
      globe-connections/
        bezier-3d-facade.tsx
        cities.json
        ConnectionsFacade.tsx
        Globe.stories.tsx
        Globe.tsx
        GlobeConnectionsExample.stories.tsx
        GlobeConnectionsExample.tsx
        XRGrabbable.tsx
      scroll-through-3d/
        index.tsx
        model.tsx
        overlay.tsx
        path-journey.tsx
        ScrollThrough3dWrapper.tsx
        ScrollThroughThreeD.tsx
        ScrollTriggerScene.stories.tsx
      ufos/
        ufo/
          Scene.jsx
          ufo-model.tsx
          ufo.stories.tsx
        ufo-alt/
          Scene.jsx
      visualizations/
        3d-grid/
          3d-grid.tsx
          index.tsx
        diagram/
          3d-graph.tsx
          basic-nodes.tsx
          graph-visualization.tsx
          index.tsx
          nodes.tsx
          scroll-controls.tsx
          spherical-connection-graph.tsx
        graph/
          index.tsx
          rtf-graph.tsx
          useModelNodes.tsx
        spatial-gallery/
          events.ts
          index.tsx
          spatial-gallery.tsx
        word-cloud/
          index.tsx
          word-cloud.tsx
      entity-network-graph-3d.tsx
      video.tsx
    admin/
      ui/
        columns.tsx
        RecordsTable.tsx
        SelectedRecordsList.tsx
        useRenderListItem.tsx
      Admin.tsx
      AdminDashboard.tsx
      index.tsx
    ai/
      actions/
        chat.actions.tsx
      ai-app-assistant/
        assistant-ui/
          markdown-text.tsx
          thread-list.tsx
          thread.tsx
          tooltip-icon-button.tsx
        full-chat-interface/
          app-sidebar.tsx
          banner.tsx
          chat-interface.tsx
          chat-message.tsx
          chat.tsx
          settings-panel.tsx
          slider-control.tsx
          team-switcher.tsx
          user-dropdown.tsx
        ai-components.tsx
        assistant.tsx
        tools.tsx
      api/
        actions.tsx
      components/
        ai-inputs/
          ai-inputs.tsx
          ai-oracle.tsx
          oracle-input.tsx
        chat-interface/
          chat-bottombar.tsx
          chat-layout.tsx
          chat-list.tsx
          chat-sidebar.tsx
          chat-textarea.tsx
          chat-topbar.tsx
          chat.tsx
          conversation.tsx
          index.tsx
        mindmap-search-ui/
          entity-quick-menu.tsx
          quick-load-button.tsx
        prompt-kit/
          ai-markdown-message/
            code-block.tsx
            highlighter.tsx
            message.tsx
            model-selector.tsx
          markdown.tsx
          reasoning.tsx
          response-stream.tsx
        prompts/
          Answer.tsx
          index.tsx
          PromptInput.tsx
          PromptMessages.tsx
          PromptPanel.tsx
          PromptState.tsx
          PromptUI.tsx
          SimilarTopics.tsx
          SourceCard.tsx
          Sources.tsx
          UserPromptMessage.tsx
        ai-assisted-search-interface.tsx
        entity-menu.tsx
        index.ts
        knowledge-graph.tsx
        markdown.tsx
        message.tsx
        mindmap-entity-loader-card.tsx
        SuggestedSearchItem.tsx
      ai.ts
      index.tsx
    case-files/
      canvas/
        canvas-annotations/
          canvas-annotations.tsx
          index.tsx
        canvas-drawer/
          canvas-drawer.tsx
          index.tsx
        canvas-grid/
          canvas-grid.tsx
          index.tsx
        demos.tsx
        index.tsx
      case-file/
        case-file-evidence/
          animated-folder.tsx
          case-file-dossier.tsx
          classification-banner.tsx
          data-grid.tsx
          evidence-browser.tsx
          evidence-card.tsx
          evidence-detail-sidebar.tsx
          evidence.mdx
          evidence.stories.tsx
          index.tsx
        case-file-folder/
          case-file.tsx
          gooey-svg-filter.tsx
      connections-ui/
        ConnectionsUi.stories.tsx
        EntityConnectionsFlow.tsx
        index.tsx
      easel-tabs/
        EaselTabs.stories.tsx
        EaselTabs.tsx
        index.tsx
      folder/
        folder-flyout.tsx
        folder-open.tsx
        folder-tabs.tsx
      notations-ui/
        index.tsx
        NotationsUi.tsx
      stacked-cards/
        exploding-stack/
          index.tsx
        exploding-stack.stories.tsx
        index.tsx
        stacked-cards.stories.tsx
        StackedCards.tsx
      flashlight-background.tsx
    collab/
      live-users.tsx
      room.tsx
    data-viz/
      components/
        globes/
          codepen-viz/
            codepen-earth-alt.tsx
            codepen-earth.tsx
          globe.tsx
          index.tsx
          mapbox-globe.tsx
        world-map/
          world-map.tsx
      sightings/
        components/
          sightings-timeseries/
            SightingsTimeSeries.stories.tsx
            SightingsTimeSeries.tsx
          deck-gl-overlay.tsx
          EventsTimeSeries.tsx
          hud-sightings-terminal.tsx
          MapPopup.tsx
          sightings-globe-settings.tsx
          VisualizationLayers.tsx
        hooks/
          use-map-initialization.tsx
          use-visualization-layers.tsx
          useTimeSeriesVisualization.tsx
        uap-dashboard/
          graph-paper-background/
            graph-paper-animation.ts
            graph-paper-background.tsx
          hooks/
            use-globe-focus.tsx
          space-hud/
            space-hud.tsx
          terminal/
            terminal.tsx
          alternative-globe.tsx
          codepen-globe.tsx
          filter-panel.tsx
          globe.tsx
          grid-background.tsx
          grid-overlay.tsx
          HudUapInterface.tsx
          pulsing-disk.tsx
          section-header.tsx
          sightings-stats-display.tsx
          sightings-visualization.tsx
          tech-corners.tsx
          tech-grid-background.tsx
          tech-section.tsx
          terminal-display.tsx
          time-range-selector.tsx
        utils/
          map-utils.ts
          sighting-filters.ts
        animated-arc-group-layer.stories.tsx
        animated-arc-group-layer.tsx
        animated-arc-layer.stories.tsx
        animated-arc-layer.tsx
        chatgpt-version.tsx
        old.tsx
        README.md
        sightings-globe-refactored.tsx
        sightings-globe.tsx
        sightings-loader.tsx
        sightings.tsx
        types.ts
        use-batched-processing.ts
        useTimeSeriesAnimation.tsx
      index.tsx
    mindmap/
      actions/
        actions.ts
        addNextEntitiesToMindMap.ts
        fetch-next-mindmap-records.ts
        get-entity-network-graph-data.ts
        search.ts
        xata-to-xyflow.ts
      components/
        cards/
          card-stack/
            animated-mini-card.tsx
            card-stack-multiview.tsx
            card-stack.tsx
            cards.tsx
          connection-card/
            connection-card.tsx
            index.tsx
          entity-card/
            entity-card-tooltip.tsx
            entity-card-utility-menu.tsx
            entity-card.tsx
            index.tsx
          entity-group-card/
            entity-group-card-bg.tsx
            entity-group-card.tsx
            events-group-card.tsx
            lights-background.tsx
            sections.tsx
            topic-group-card.tsx
          event/
            bonsai-card.tsx
            event-globe-card.tsx
            grid-card.tsx
            photo-carousel.tsx
          graph-card/
            graph-card-bg.tsx
            graph-card.tsx
            index.tsx
          root-node-card/
            index.tsx
            InputWithVanishAnimation.tsx
            root-node-card.tsx
            RootNodeToolbar.tsx
            search-input-spotlight.tsx
          subject-matter-expert-card/
            index.tsx
            SubjectMatterExpertCard.tsx
          basic-mindmap-cards.tsx
          index.tsx
          layer-zero-card.tsx
          luxe-card.tsx
          mini-card.tsx
          render-entity-card.tsx
          testimony-card.tsx
          topic-card.tsx
        clones/
          clone-node.tsx
        launchpad/
          launchpad.stories.tsx
          launchpad.tsx
        menus/
          expandable-tab-menu.tsx
          floating-node-menu.tsx
          index.tsx
          mindmap-ai-chat.tsx
          mindmap-animated-click-menu.tsx
          mindmap-bottom-menu.tsx
          mindmap-side-menu.tsx
          mindmap-utility-cursor.tsx
          model-action-toolbar.stories.tsx
          model-action-toolbar.tsx
          NodeMenu.tsx
          oracle-sphere.stories.tsx
          oracle-sphere.tsx
        note/
          BlockEditor/
            components/
              EditorHeader.tsx
              EditorInfo.tsx
            BlockEditor.tsx
            index.tsx
            types.tsx
          context/
            EditorContext.ts
          extensions/
            AiImage/
              components/
                AiImageView.tsx
              AiImage.tsx
              index.ts
            AiWriter/
              components/
                AiWriterView.tsx
              AiWriter.tsx
              index.ts
            BlockquoteFigure/
              Quote/
                index.ts
                Quote.ts
              QuoteCaption/
                index.ts
                QuoteCaption.ts
              BlockquoteFigure.ts
              index.ts
            Document/
              Document.ts
              index.ts
            EmojiSuggestion/
              components/
                EmojiList.tsx
              index.ts
              suggestion.ts
              types.ts
            Figcaption/
              Figcaption.ts
              index.ts
            Figure/
              Figure.ts
              index.ts
            FontSize/
              FontSize.ts
              index.ts
            Heading/
              Heading.ts
              index.ts
            HorizontalRule/
              HorizontalRule.ts
              index.ts
            Image/
              Image.ts
              index.ts
            ImageBlock/
              components/
                ImageBlockMenu.tsx
                ImageBlockView.tsx
                ImageBlockWidth.tsx
              ImageBlock.ts
              index.ts
            ImageUpload/
              view/
                hooks.ts
                ImageUpload.tsx
                ImageUploader.tsx
                index.tsx
              ImageUpload.ts
              index.ts
            Link/
              index.ts
              Link.ts
            MultiColumn/
              menus/
                ColumnsMenu.tsx
                index.ts
              Column.ts
              Columns.ts
              index.ts
            Selection/
              index.ts
              Selection.ts
            SlashCommand/
              CommandButton.tsx
              groups.ts
              index.ts
              MenuList.tsx
              SlashCommand.ts
              types.ts
            Table/
              menus/
                TableColumn/
                  index.tsx
                  utils.ts
                TableRow/
                  index.tsx
                  utils.ts
                index.tsx
              Cell.ts
              Header.ts
              index.ts
              Row.ts
              Table.ts
              utils.ts
            TableOfContentsNode/
              index.ts
              TableOfContentsNode.tsx
            TrailingNode/
              index.ts
              trailing-node.ts
            extension-kit.ts
            index.ts
          hooks/
            useAIState.tsx
            useBlockEditor.ts
            useSidebar.tsx
          lib/
            data/
              initialContent.tsx
            utils/
              cssVar.ts
              getConnectionText.ts
              getRenderContainer.ts
              index.ts
              isCustomNodeSelected.ts
              isTextSelected.ts
            api.ts
            constants.tsx
          menus/
            ContentItemMenu/
              hooks/
                useContentItemActions.tsx
                useData.tsx
              ContentItemMenu.tsx
              index.tsx
            LinkMenu/
              index.tsx
              LinkMenu.tsx
            TextMenu/
              components/
                AIDropdown.tsx
                ContentTypePicker.tsx
                EditLinkPopover.tsx
                FontFamilyPicker.tsx
                FontSizePicker.tsx
              hooks/
                useTextmenuCommands.ts
                useTextmenuContentTypes.ts
                useTextmenuStates.ts
              index.tsx
              TextMenu.tsx
            index.ts
            types.ts
          panels/
            Colorpicker/
              ColorButton.tsx
              Colorpicker.tsx
              index.tsx
            LinkEditorPanel/
              index.tsx
              LinkEditorPanel.tsx
            LinkPreviewPanel/
              index.tsx
              LinkPreviewPanel.tsx
            index.tsx
          Sidebar/
            index.tsx
            Sidebar.tsx
          TableOfContents/
            index.tsx
            TableOfContents.tsx
          ui/
            Button/
              Button.tsx
              hover-expand-button.tsx
              index.tsx
              shiny-button.tsx
            Dropdown/
              Dropdown.tsx
              index.tsx
            Loader/
              index.ts
              Loader.tsx
              types.ts
            Panel/
              index.tsx
            Spinner/
              index.tsx
              Spinner.tsx
            Textarea/
              index.tsx
              Textarea.tsx
            Toggle/
              index.tsx
              Toggle.tsx
            Tooltip/
              index.tsx
              types.ts
            Icon.tsx
            PopoverMenu.tsx
            Surface.tsx
            Toolbar.tsx
          index.tsx
          Note.tsx
        status-ui/
          agent-notifications-log.stories.tsx
          agent-notifications-log.tsx
          case-files-and-evidence-board.stories.tsx
          case-files-and-evidence-board.tsx
          graph-status-log.stories.tsx
          graph-status-log.tsx
          index.tsx
          session-notes.stories.tsx
          session-notes.tsx
          thread-board.tsx
        ask-ai.tsx
        base-handle.tsx
        button-handle.tsx
        connection-list.tsx
        example-client-component.tsx
        labeled-handle.tsx
        node-status-indicator.tsx
      config/
        edge-types.tsx
        functions.ts
        index.config.ts
        initial-nodes.ts
        node-types.tsx
        nodes.config.ts
      edges/
        animated-svg-edge.tsx
        button-edge.tsx
        data-edge.tsx
        FloatingConnectionLine.tsx
        FloatingEdge.tsx
        FlowEdge.tsx
        index.tsx
        RootEdge.tsx
        SequentialEdge.tsx
        SiblingEdge.tsx
      hooks/
        useAnimateNodes.tsx
        useAskXata.ts
        useAutoLayout.tsx
        useAutoLayoutAlt.tsx
        useExpandCollapse.tsx
        useForceLayout.tsx
        useGroupNode.tsx
        useRootNodesHierarchy.tsx
        useSyncChildNodePositions.tsx
      layouts/
        algorithms/
          d3-dag.ts
          d3-hierarchy.ts
          dagre-tree.ts
          elk-layout.ts
          elk.ts
          entitree-flex.ts
          index.ts
          origin.ts
        collide.ts
        index.ts
        organizeNodeLayout.ts
        types.ts
        utils.ts
      nodes/
        user-input-node/
          anchor.tsx
          animated-markdown.tsx
          user-input-node.tsx
        animated-node.tsx
        annotation-node.tsx
        AnnotationNode.tsx
        base-node.tsx
        core-node-ui.tsx
        database-schema-node.tsx
        document-node.tsx
        entity-group-node-child.tsx
        entity-group-node.tsx
        entity-node.tsx
        group-results-node.tsx
        index.tsx
        personnel-group-node-child.tsx
        personnel-group-node.tsx
        root-node.tsx
        testimony-node.tsx
      store/
        index.ts
        mindmap-store.ts
      utils/
        conversions.ts
        layout-utils.ts
      workflows/
        base-handle.tsx
        base-node.tsx
        content-creator-routing.ts
        developer-tasks-orchestrator.ts
        editable-handle.tsx
        exam-creator-parallelization.ts
        generate-ai-text.ts
        generate-text-node-controller.tsx
        labeled-handle.tsx
        node-factory.ts
        node-header-status.tsx
        node-header.tsx
        nodes-panel.tsx
        prompt-crafter-node-controller.tsx
        resizable-node.tsx
        server-node-processors.ts
        sse-workflow-execution-client.ts
        sse-workflow-execution-engine.ts
        status-edge-controller.tsx
        text-input-node-controller.tsx
        text-input-node.tsx
        visualize-text-node-controller.tsx
        visualize-text-node.tsx
        workflow-execution-engine.ts
        workflow.ts
      graph.tsx
      index.tsx
      mind-map.tsx
      types.ts
    r3f/
      components/
        canvas/
          Examples.jsx
          Scene.jsx
          View.jsx
          WebGpuCanvas.tsx
        dom/
          Layout.jsx
        post-processing.tsx
      helpers/
        components/
          Three.jsx
        global.js
      templates/
        hooks/
          usePostprocess.jsx
        Shader/
          glsl/
            shader.frag
            shader.vert
          Shader.jsx
        Scroll.jsx
    user/
      api/
        save-event.ts
      theory/
        index.tsx
        user-theory-whiteboard.tsx
      get-user-by-auth-id.tsx
      index.tsx
  hooks/
    flow/
      use-workflow.ts
    geolocation.ts
    index.tsx
    intersection-observer.ts
    use-custom-cursor.ts
    use-detect-browser.tsx
    use-mobile.ts
    use-mobile.tsx
    use-screen-size.tsx
    use-scroll-to-bottom.ts
    use-sightings-data.ts
    use-textarea-resize.ts
    use3dGraph.tsx
    useAutoResizeTextArea.tsx
    useBackendChat.ts
    useCanvasCursor.tsx
    useClickOutside.tsx
    useContextMenu.tsx
    useEntity.tsx
    useMousePosition.tsx
    useOutsideClick.tsx
    useRemoteImage.ts
    useSSE.tsx
    useTextAnimator.tsx
    useTextSplitter.tsx
    useTimelineConfig.tsx
    useVisibility.tsx
    useWindowSize.tsx
  layouts/
    explore/
      key-figures/
        KeyFiguresGrid.tsx
    historical-events-timeline/
      event-case-file/
        EventCaseFileContainer.tsx
      events-globe.tsx
      events-timeline.tsx
      geo-spatial-functions.ts
      historical-events-timeline.stories.tsx
      historical-events-timeline.tsx
      HorizontalTimeline.tsx
      index.tsx
      sci-fi-globe.tsx
      timeline-item.tsx
      timeline-photo-gallery.tsx
      timeline-tooltip.tsx
      types.ts
      VerticalTimeline.tsx
      view-selector.tsx
      world-map.tsx
    home/
      astronaut/
        astronaut.tsx
      DoubleHelix.tsx
      home.stories.tsx
      home.tsx
      index.tsx
      LovecraftQuote.tsx
      ScanDepthMapHome.tsx
      Scene3D.tsx
      SceneRenderer.tsx
      SiteTitle.tsx
      TitleAlt.tsx
  services/
    ai/
      claude/
        get-claude-response.ts
        index.ts
      embeddings/
        embedding.tsx
      openai/
        functions/
          embeddings.ts
          functions.ts
          generate-resource.ts
          summarize.ts
        tools/
          functions.spec.json
          search-database.ts
        config.ts
        disclosure-agent.ts
        helpers.ts
        index.ts
        stream-handler.ts
      prompts/
        disclosure-assistant.prompt.ts
        knowledge-graph.prompt.ts
        ner-extraction-prompt.ts
        researchers.prompt.ts
        structure-the-unstructured.prompt.ts
        summarize.prompt.ts
        text-to-db-prompt.ts
      tools/
        exa/
          agent.ts
          exa-ai.ts
        tavily/
          agent.ts
          tavily.ts
        postgres.ts
      workflows/
        prompt-to-multistep.workflow.ts
        transform-for-reactflow.ts
    cloudflare/
      worker.ts
    knowledge-layer/
      memory.ts
      process-resource.ts
    mastra/
      agents/
        index.ts
      tools/
        index.ts
      workflows/
        index.ts
      index.ts
    ranking/
      personnel-ranking.service.ts
      README.md
    resource-scrape/
      firecrawl.ts
      index.ts
      jina.ts
      multion-ai.ts
      resource-scrape.ts
    sightings/
      actions/
        docs.md
        events-time-chunk.ts
        sightings-ai-analysis.ts
        sightings-time-chunk.ts
      get-events.ts
      get-sightings.ts
      status.md
      uap-monitor.ts
      uap-sighting.ts
      utils.ts
  tests/
    mindmap-flow-test.tsx
  types/
    xata-extensions.d.ts
  README.md
.cursorignore
.eslintrc
.gitignore
.mcp.json
.prettierrc
.repomixignore
.xatarc
bunplop.js
CLAUDE.md
components.json
cursor-tools.config.json
erd-diagram.mermaid
eslint.config.mjs
global.d.ts
liveblocks.config.ts
next.config.ts
plopfile.js
postcss.config.mjs
README-task-master.md
README.md
repomix.config.json
shader.d.ts
tailwind.config.ts
tsconfig.json
vercel.json
```

# Files

## File: src/components/timeline-roadmap/index.tsx
````typescript

````

## File: src/services/sightings/status.md
````markdown
Based on the code review and investigation, I now have a comprehensive understanding of the sightings visualization feature and the issues it's experiencing. Let me provide a detailed analysis of the problems and propose solutions.

Analysis of UAP Sightings Visualization Issues

Key Components Involved

1. Data Fetching: sightings-time-chunk.ts and events-time-chunk.ts handle fetching data from Xata
2. Data Validation: UAPSightingSchema in uap-sighting.ts validates fetched data
3. Data Serialization: serialization.ts handles converting Xata records to client-safe objects
4. Visualization: Globe components in VisualizationLayers.tsx and globe.tsx render the data

Primary Issues Identified

1. Xata Query Parameter Issues
•  In sightings-time-chunk.ts, filter parameters for Xata queries appear to be causing errors ("invalid key [filter] in request")
•  The syntax used for nested aggregation filters may not match Xata's expected format
•  Similar issues exist in events-time-chunk.ts

2. Data Validation and Processing Problems
•  The validation schema in UAPSightingSchema may be too strict for real-world data
•  Many sightings lack coordinates, preventing proper globe rendering
•  The code attempts fallbacks but might not be handling all edge cases correctly

3. Data Serialization Issues
•  serializeXataRecords in serialization.ts might not be preserving all necessary properties
•  Coordinates data may be getting lost or malformed during serialization

4. Globe Rendering Challenges
•  The AdaptiveRenderingLayers component needs properly formatted data with coordinates
•  The PointsLayer component may not have sufficient error handling for missing coordinates
•  There's a reliance on the getZoomConfig function which seems to be unavailable or not working correctly

Recommendations for Fixing the Issues

1. Fix the Xata query filter syntax issues
2. Improve data validation to be more tolerant of real-world data
3. Ensure coordinates are properly preserved during serialization
4. Add better error handling in visualization components
5. Implement fallback strategies for missing coordinates

Now that I have a clear understanding of the issues, I'll proceed with implementing the solutions according to the plan.
I see that the repomix ls --tree command didn't work with the specified option. Let's try a more standard approach to explore the repository structure.
Now let's look at the visualization components to understand how the data is being rendered.
Now I have a comprehensive understanding of the UAP sightings visualization feature and the specific issues it's facing. Here's a summary of the problems and their solutions:

Key Issues Identified

1. Xata Query Filter Issues:
•  The error message "invalid key [filter] in request" suggests the syntax for nested filter parameters is incorrect.
•  In sightings-time-chunk.ts and events-time-chunk.ts, the filters are constructed in a way that may not align with Xata's expected format.
2. Data Validation and Coordinates Issues:
•  The UAPSightingSchema in uap-sighting.ts defines coordinates as optional, but the visualization components require coordinates to render points.
•  There's extensive error handling and fallback logic in place, but it may be insufficient.
3. Data Serialization:
•  The serializeXataRecords function might be dropping important data during serialization.
•  Coordinates data could be lost during the transformation from Xata records to client-safe objects.
4. Globe Component Rendering Issues:
•  The PointsLayer component doesn't handle missing coordinates gracefully, causing rendering failures.
•  The AdaptiveRenderingLayers component relies on a function called getZoomConfig that might not be providing appropriate configuration.

Solution Approach

Based on my analysis, I'll implement the following fixes:

1. Fix Xata Query Filters:
•  Update the filter syntax in both sightings-time-chunk.ts and events-time-chunk.ts.
•  Ensure consistent structure between date range filters and other query parameters.
2. Improve Coordinates Handling:
•  Enhance the data validation to be more tolerant of missing coordinates.
•  Implement fallback coordinates for points that don't have them, to ensure visualization continuity.
3. Optimize SerializeXataRecords:
•  Ensure the serialization utility correctly preserves nested coordinate objects.
•  Add specific handling for the location.coordinates object.
4. Enhance Visualization Components:
•  Update PointsLayer component to handle missing coordinates gracefully.
•  Fix the interaction between AdaptiveRenderingLayers and the zoom configuration.

Let's start with implementing these solutions one by one, starting with the most critical issue: the Xata query filter syntax in the sightings-time-chunk.ts file.
After examining the code and the error message, it's clear the main problem is in how Xata API is being called, specifically in the filter syntax for aggregations. The error "invalid key [filter] in request" is occurring in aggregation queries in both sightings-time-chunk.ts and events-time-chunk.ts.

Looking at the Xata documentation, the issue appears to be in how filters are structured within aggregation requests. The current implementation is trying to use a "filter" key inside aggregation objects, but based on the error, this isn't the correct syntax for Xata's API.

I need to modify all instances where this filter syntax is being used, particularly in:

1. getSightingsStats function
2. getEventStats function

The correct approach seems to be to use the global filter at the top level of the aggregate request, rather than nesting it inside individual aggregation definitions.

I'll create a diff to update the sightings-time-chunk.ts file first, focusing on fixing the filter syntax in all the aggregation calls.
After analyzing the sightings-time-chunk.ts file, I can see several problems with the filter syntax in the aggregation queries. The errors in the console log show "invalid key [filter] in request", which suggests the Xata API doesn't accept filters inside aggregation definitions the way they're currently implemented.

Looking at lines 544-553 and 556-576, I can see the main issues:

1. In the countAggregation query, there's a filter property inside the totalCount aggregation object.
2. There are no filters applied to the dateAggregation query which might be causing data inconsistencies.

I also see issues with the event-time-chunk.ts file which would have similar problems based on the console error. I should fix both issues.

I'll make the following changes:

1. Update the syntax for the aggregation queries to use a global filter property at the top level of the aggregate request instead of nested inside each aggregation.
2. Fix all the aggregation queries to follow the correct Xata syntax.
3. Apply proper error handling to make debugging easier.

Let me create a diff to fix these issues:
After reviewing the code in VisualizationLayers.tsx and globe.tsx, I see several issues that need to be addressed:

1. In VisualizationLayers.tsx:
•  The PointsLayer component doesn't properly validate coordinates before rendering (line 131-132).
•  There's no fallback handling for points with missing coordinates.
•  The filtering logic could be optimized.
2. In globe.tsx:
•  The clustering logic doesn't properly handle sightings with missing coordinates (around line 194-216).
•  There's potential for rendering errors when coordinates are missing.
•  Error handling and logging are minimal.

I'll create a diff for both files to address these issues:

1. For VisualizationLayers.tsx, I'll:
•  Add more robust validation for coordinates
•  Implement fallback handling for missing coordinates
•  Improve the filtering and performance of point rendering
2. For globe.tsx, I'll:
•  Enhance the clustering logic to properly handle missing coordinates
•  Improve the Earth component for better performance
•  Add better error handling and logging
Now I understand the structure of the UAPSightingSchema. The key issues to address are:

1. Making the state field optional since many records might not have this information
2. Enhancing the coordinates validation to ensure valid lat/lng values when present
3. Adding utility functions to validate and work with coordinates

Here's my plan for updating the schema:

1. Make the state field optional by adding .optional() to its declaration
2. Enhance the coordinates validation:
•  Keep it optional but validate more thoroughly when present
•  Add constraints for lat/lng ranges (-90 to 90 for lat, -180 to 180 for lng)
3. Add utility functions:
•  isValidCoordinates - To check if coordinates are valid
•  getValidCoordinates - To safely retrieve coordinates or return null
•  ensureValidCoordinates - To make sure coordinates are valid before using them

Let me create a diff with these changes:
I need to update the serialization.ts utility to ensure that location coordinates are properly preserved during serialization of Xata records. Based on the existing code I examined previously, I know the current serialization utility might not be handling coordinates as effectively as it could.

The key issues to address are:

1. Enhance the serializeXataRecord function to properly detect and handle location and coordinate fields
2. Add special handling for nested coordinates objects
3. Add validation to ensure coordinates are valid before including them
4. Implement more robust handling of different coordinate formats

Let me create a diff to update the serialization.ts file.
Now that I have updated all the key components involved in the UAP sightings visualization feature, I should explain what I've done and provide a summary of the changes I made to fix the issues.

Here's a comprehensive summary of the changes I've made:

1. Fixed Xata Query Filters in sightings-time-chunk.ts:
•  Updated the filter syntax for Xata queries to match the expected format
•  Fixed the aggregate queries by using the correct filter structure
•  Implemented proper error handling and fallback mechanisms
•  Added extensive debugging logs to help identify issues
2. Enhanced Coordinates Handling:
•  Updated the UAPSightingSchema to make state field optional
•  Added utility functions for validating coordinates
•  Created fallback mechanisms for handling missing coordinates
•  Added additional validation for coordinate data
3. Improved SerializeXataRecords in serialization.ts:
•  Added special handling for location and coordinates fields
•  Implemented robust normalization of coordinate data
•  Ensured coordinates are preserved during serialization
•  Added validation to verify coordinates are valid before inclusion
4. Enhanced Visualization Components:
•  Updated the PointsLayer component to gracefully handle missing coordinates
•  Improved validation in the Globe component
•  Added fallback content for when no valid coordinates are available
•  Optimized rendering performance for large datasets
5. Debugging and Monitoring:
•  Added comprehensive logging throughout the data flow
•  Implemented metrics for tracking valid vs. invalid data points
•  Added fallback UI elements to display when data is incomplete

These changes should resolve the issues with the UAP sightings visualization by:
•  Ensuring Xata queries are correctly structured
•  Properly validating and handling coordinate data
•  Providing graceful fallbacks when data is incomplete
•  Optimizing performance for visualization components

The result is a more robust and resilient visualization system that can handle the variations and imperfections in the data while still providing a useful and interactive experience for users.
I now have a complete understanding of the UAP sightings visualization system, including the main page component that ties everything together. Let me finalize my solution and provide a summary of all the changes I've made.

Based on my analysis and fixes, here's a comprehensive solution to the issues with the UAP sightings visualization feature:

1. Xata Query Filter Issues
•  I fixed the syntax in sightings-time-chunk.ts for nested filter parameters to use the correct format required by Xata.
•  I updated the aggregation queries to follow Xata's documentation for filter structure.
•  Added comprehensive error handling and logging to track query issues.
•  Implemented fallback mechanisms to try different queries when initial queries fail.

2. Data Validation and Coordinates Issues
•  Updated UAPSightingSchema to make the state field optional and added better coordinate validation.
•  Added utility functions (isValidCoordinates, getValidCoordinates, ensureValidCoordinates) for coordinates handling.
•  Created fallback mechanisms to handle missing or invalid coordinates.
•  Enhanced the coordinate validation to check for numeric values, NaN values, and proper ranges.

3. Data Serialization Issues
•  Enhanced serializeXataRecords to properly handle location and coordinates fields.
•  Added normalization functionality for coordinates in different formats.
•  Implemented specific handling for nested coordinate objects.
•  Added validation to ensure only valid coordinates are included in serialized output.

4. Visualization Component Issues
•  Added robust coordinate validation in PointsLayer and Globe components.
•  Implemented better filtering of valid points to improve performance.
•  Added fallback content for when no valid coordinates are available.
•  Enhanced error handling and logging in the visualization components.

5. Additional Improvements
•  Added helpful logging throughout the data flow to track the number of valid vs. invalid coordinates.
•  Implemented normalization of different coordinate formats (lat/lng, latitude/longitude, lat/lon).
•  Created fallback UI elements to display when data is incomplete.
•  Optimized rendering performance by filtering invalid data points earlier in the process.

These changes create a more robust and resilient system that can handle the variations and imperfections in the data while still providing a useful and interactive visualization experience for users.

Key Workflow Improvements:

1. Better Data Quality Checks: Implemented validation at each step of the process to catch and handle issues.
2. Graceful Degradation: The system now fails gracefully when data is incomplete.
3. Performance Optimization: Filtering invalid data points earlier improves rendering performance.
4. Debugging Support: Added comprehensive logging to help identify and fix issues.
5. Consistent Data Structure: Normalized different coordinate formats to a standard structure.

The changes address all the issues identified in the UAP sightings visualization feature, resulting in a more robust and user-friendly application that can handle real-world data with its variations and imperfections.
````

## File: src/services/sightings/utils.ts
````typescript
export function getZoomConfig(cameraDistance: number)
export function groupSightingsByDecade(sightings: any[])
export function getDecadeDistribution(sightings: any[])
````

## File: bunplop.js
````javascript
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.stdin.resume();
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
Plop.prepare(
⋮----
cwd: process.cwd(),
configPath: path.join(__dirname, "plopfile.js"),
⋮----
dest: process.cwd(),
⋮----
return Plop.execute(env, (env) => run(options, undefined, true));
````

## File: src/app/(auth)/admin/actions.ts
````typescript
import { getXataClient } from '@/db/xata'
⋮----
export async function getEvents()
export async function getKeyFigures()
export async function getTestimonies()
export async function getOrganizations()
export async function getTopics()
````

## File: src/app/(auth)/admin/page.tsx
````typescript
import { AdminDashboard } from '@/features/admin/AdminDashboard'
export default async function Index()
````

## File: src/app/(auth)/sign-in/[[...sign-in]]/page.tsx
````typescript
import { SignIn } from '@clerk/nextjs'
import React from 'react'
import { getUserByAuthId } from '@/features/user/get-user-by-auth-id'
import { currentUser, clerkClient } from '@clerk/nextjs/server'
export default async function Page()
````

## File: src/app/(auth)/sign-up/[[...sign-up]]/page.tsx
````typescript
import { SignUp } from '@clerk/nextjs'
import React from 'react'
export default function Page()
````

## File: src/app/(site)/explore/disclosure/loading.tsx
````typescript
import {SightingsLoader} from '@/features/data-viz/sightings/sightings-loader'
export default function Loading()
````

## File: src/app/(site)/explore/event/[id]/page.tsx
````typescript
import { xata } from "@/db/xata"
export default async function EventPage(props)
````

## File: src/app/(site)/explore/key-figures/components/whos-who-gallery.tsx
````typescript
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  useCursor,
  MeshReflectorMaterial,
  Image,
  Text,
  Environment,
} from '@react-three/drei'
import { easing } from 'maath'
````

## File: src/app/(site)/explore/key-figures/page.tsx
````typescript
import { getXataClient } from '@/db/xata'
import { Particles } from '@/components/animated/particles/Particles'
import SwipeGrid from '@/components/animated/swipe-grid/SwipeGrid'
import { TextEffect } from '@/components/animated/text-effect'
import { Loading } from '@/components/loaders/loading'
import { cn } from '@/utils'
import { Suspense } from 'react'
type photo = {
  signedUrl: string
  enablePublicUrl: boolean
}
type KeyFigure = {
  name: string
  bio: string
  role: string
  photo: photo | photo[]
  facebook: string
  twitter: string
  website: string
  instagram: string
  rank: number
  credibility: number
  popularity: number
}
export type KeyFiguresArray = KeyFigure[]
export default async function Index()
````

## File: src/app/(site)/explore/topic/[id]/page.tsx
````typescript
export default async function TopicPage(props)
````

## File: src/app/(site)/explore/layout.tsx
````typescript
export default function Layout(
````

## File: src/app/(site)/explore/loading.tsx
````typescript
import { MultiStepLoader } from '@/components/multistep-loader'
export default function Loading()
````

## File: src/app/(site)/history/events/[id]/page.tsx
````typescript
export default async function EventPage()
````

## File: src/app/(site)/sightings/realtime/error.tsx
````typescript
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
export default function ErrorComponent( {
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
} )
````

## File: src/app/(site)/sightings/realtime/loading.tsx
````typescript
import { GlobeLoading } from '@/components/ui/loading/globe-loading'
import { Skeleton } from '@/components/ui/skeleton'
````

## File: src/app/(site)/timeline/page.tsx
````typescript
import { getXataClient, type EventsRecord } from '@/db/xata'
import { type JSONData } from '@xata.io/client'
import { TimelineViews } from './timeline-views'
⋮----
export default async function TimelinePage()
````

## File: src/app/(site)/timeline/timeline-views.tsx
````typescript
import { type EventsRecord } from '@/db/xata'
import { HistoricalEventsTimeline } from '@/layouts/historical-events-timeline/historical-events-timeline'
import { type ViewMode } from '@/layouts/historical-events-timeline/types'
import { ViewSelector } from '@/layouts/historical-events-timeline/view-selector'
import { type JSONData } from '@xata.io/client'
import { useState } from 'react'
interface TimelinePageClientProps {
  events: JSONData<EventsRecord>[]
}
````

## File: src/app/api/admin/trigger-ranking-update/route.ts
````typescript
import { NextResponse } from "next/server";
import { calculatePersonnelRanking } from "@/services/ranking/personnel-ranking.service";
⋮----
interface WeightParams {
  EVENT_PARTICIPATION: number;
  TOPIC_EXPERTISE: number;
  ORGANIZATIONAL_ROLE: number;
  DOCUMENTED_EVIDENCE: number;
  TESTIMONY_COUNT: number;
  QUOTE_COUNT: number;
}
export async function POST(request: Request)
````

## File: src/app/api/chat/route.ts
````typescript
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
⋮----
export async function POST(req: Request)
````

## File: src/app/api/cron/update-rankings/route.ts
````typescript
import { NextResponse } from "next/server";
import { calculatePersonnelRanking } from "@/services/ranking/personnel-ranking.service";
⋮----
export async function GET()
````

## File: src/app/api/disclosure/chat/route-demo.ts
````typescript
import { openai } from "@/lib/openai/client";
import { DISCLOSURE_ASSISTANT_ID } from "@/services/ai/openai/config";
import { searchDatabase } from "@/services/ai/openai/tools/search-database";
import { NER_EXTRACTION_PROMPT } from "@/services/ai/prompts/ner-extraction-prompt";
import { AssistantResponse } from "ai";
interface ToolResults {
	fileSearchResult?: {
		response: string;
		entities: Record<string, string>[];
	};
}
export async function POST(req: Request)
function extractEntitiesFromQuery(query: string): Record<string, string>[]
````

## File: src/app/api/disclosure/data-layer/aggregate/route.ts
````typescript
import { getXataClient } from '@/db/xata'
import { type NextRequest } from 'next/server'
⋮----
export async function GET( request: NextRequest )
````

## File: src/app/api/disclosure/data-layer/ask/route.ts
````typescript
import { getXataClient } from '@/db/xata'
⋮----
export async function POST( req )
````

## File: src/app/api/disclosure/data-layer/backup/route.ts
````typescript
import { supabaseServer } from '@/db/supabase'
import { exec } from 'child_process'
import type { NextRequest } from 'next/server'
import { promisify } from 'node:util'
import path from 'path'
⋮----
export async function POST( request: NextRequest )
````

## File: src/app/api/disclosure/data-layer/enrich/route.ts
````typescript
import { executePlatformWideConnectionSearch } from '@/db/xata'
import { checkRelevanceWithAI } from '@/services/ai/openai'
export async function POST( req: any )
````

## File: src/app/api/disclosure/data-layer/scrape/batch/route.ts
````typescript
import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  ResearchCategory,
  ResearchDepth
} from '@/services/resource-scrape'
import { processMultipleResources, processResource } from '@/services/knowledge-layer/process-resource'
import { EXTERNAL_RESOURCES } from '@/utils'
⋮----
export async function POST(request: Request)
⋮----
// If custom URLs are provided, use those instead of the external resources
⋮----
// Build a filter function based on the URL filter string
let resourceFilter = (url: string)
⋮----
resourceFilter = (url: string)
⋮----
// Process multiple resources with the given filter
⋮----
export async function GET(request: Request)
````

## File: src/app/api/disclosure/data-layer/search/connections/route.ts
````typescript
import { executePlatformWideConnectionSearch, xata } from '@/db/xata'
import {
  askDisclosureAgentToFindRelatedRecords
} from '@/lib/openai'
import { NextRequest, NextResponse } from 'next/server'
export async function GET( request: NextRequest )
````

## File: src/app/api/disclosure/data-layer/search/table/route.ts
````typescript
import { executeDatabaseTableQuery } from '@/db/xata'
import { NextRequest, NextResponse } from 'next/server'
export type SearchResult = {
  suggestedSearchResult: any
  relatedResults: any
  totalCount: number
}
type ErrorResponse = {
  error: string
}
export async function GET( request: NextRequest ): Promise<NextResponse<SearchResult | ErrorResponse>>
````

## File: src/app/api/disclosure/knowledge-layer/process/route.ts
````typescript
import { askDisclosureAgent } from "@/services/ai/openai/disclosure-agent"
export async function POST( req: Request )
````

## File: src/app/api/disclosure/knowledge-layer/vector-store/files/[fileId]/route.ts
````typescript
import { openai } from '@/lib/openai/client'
export async function GET(_request, props: any)
````

## File: src/app/api/disclosure/knowledge-layer/vector-store/files/list/route.ts
````typescript
import { UFO_VECTOR_DATA_STORE_ID } from '@/lib/openai'
import { openai } from '@/lib/openai/client'
import { writeLogToFile } from '@/utils'
export async function GET()
⋮----
const getFiles = async ( last_id: string | null )
````

## File: src/app/api/disclosure/process-resource/route.ts
````typescript
import { askDisclosureAgent } from "@/services/ai/openai/disclosure-agent"
export async function POST( req: Request )
````

## File: src/app/api/internal/export/route.ts
````typescript
import { NextResponse } from 'next/server'
async function executeCommand( command: string ): Promise<
function parseCSV( csvContent: string )
export async function POST()
⋮----
// Read CSV file
⋮----
// 5. Clean up exports
⋮----
// Return the exported data
````

## File: src/app/api/internal/key-figures/route.ts
````typescript
import { xata } from '@/db/xata'
import { type NextRequest } from 'next/server'
export async function POST( request: NextRequest )
````

## File: src/app/api/sse/test/route.ts
````typescript
import { NextResponse } from 'next/server';
⋮----
export async function GET()
````

## File: src/app/api/sse/xata/ask/send/route.ts
````typescript
import { NextRequest } from "next/server";
import { clients } from "../shared";
import { logDebug, encodeSSE, broadcastMessage } from "../utils";
export async function POST(request: NextRequest)
````

## File: src/app/api/sse/xata/ask/route.ts
````typescript
import { getXataClient } from '@/db/xata'
import type { AskResult } from '@xata.io/client'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
⋮----
export function logDebug(message: string, data?: unknown): void
// Encode data in SSE format
function encodeSSE(event: string, data: string): Uint8Array
// GET endpoint to establish SSE connection
export async function GET(request: NextRequest)
⋮----
start(controller)
⋮----
// Send simple connection confirmation
⋮----
export async function POST(request: NextRequest)
⋮----
async start(controller)
````

## File: src/app/api/sse/xata/ask/shared.ts
````typescript
import { ReadableStreamDefaultController } from "stream/web";
````

## File: src/app/api/sse/xata/ask/utils.ts
````typescript
import { ReadableStreamDefaultController } from "stream/web";
⋮----
export function logDebug(message: string, data?: unknown): void
// SSE message encoding
export function encodeSSE(event: string, data: string): string
// Enhanced broadcast function with improved error handling and connection verification
export function broadcastMessage(event: string, message: unknown): void
⋮----
// Check if we have any connected clients
⋮----
// Format the message consistently
⋮----
// Convert to string
````

## File: src/app/api/test-xata/route.ts
````typescript
import { xata } from "@/db/xata";
import { NextRequest } from "next/server";
export async function POST(request: NextRequest)
⋮----
// Run the ask function with a callback to collect messages
````

## File: src/app/api/workflow/execute/route.ts
````typescript
import { serverNodeProcessors } from "@/lib/flow/server-node-processors";
import { executeServerWorkflow } from "@/lib/flow/sse-workflow-execution-engine";
import type { WorkflowDefinition } from "@/lib/flow/workflow";
import { NextResponse } from "next/server";
⋮----
export async function POST(req: Request)
⋮----
async start(controller)
````

## File: src/app/fonts.tsx
````typescript
import localFont from 'next/font/local'
````

## File: src/app/loading.tsx
````typescript
import { Loading as LoadingScreen } from '@/components/loaders'
export default function Loading()
````

## File: src/components/9-ui/toolbar.tsx
````typescript
import { Toolbar as BaseToolbar } from "@base-ui-components/react/toolbar"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { cn } from "@/utils"
````

## File: src/components/animated-workflow/animated-workflow.tsx
````typescript
import {
	type MotionValue,
	motion,
	useScroll,
	useTransform,
} from "framer-motion";
import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
interface Node {
	id: string;
	type: "logic" | "input" | "output" | "request";
	title: string;
	value?: string;
	x: number;
	y: number;
}
⋮----
const getNodeById = (id: string)
const createPath = (
		startX: number,
		startY: number,
		endX: number,
		endY: number,
) =>
````

## File: src/components/app-sidebar/AppSidebar.tsx
````typescript
import { cn } from '@/utils/cn'
import Link, { LinkProps } from 'next/link'
import React, { useState, createContext, useContext } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { XIcon as CloseIcon, MenuIcon } from 'lucide-react'
interface Links {
  label: string
  href: string
  icon: React.JSX.Element | React.ReactNode
}
interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
⋮----
export const useAppSidebar = () =>
export const AppSidebarProvider = ( {
  children,
  open: openProp,
  setOpen: setOpenProp,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
} ) =>
export const AppSidebar = ( {
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
} ) =>
⋮----
className=
````

## File: src/components/app-sidebar/index.tsx
````typescript

````

## File: src/components/backgrounds/animated-grid-pattern/AnimatedGridPattern.tsx
````typescript
import { motion } from 'framer-motion'
import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/utils/cn'
interface GridPatternProps {
  width?: number
  height?: number
  x?: number
  y?: number
  strokeDasharray?: any
  numSquares?: number
  className?: string
  maxOpacity?: number
  duration?: number
  repeatDelay?: number
}
⋮----
function getPos()
function generateSquares( count: number )
const updateSquarePosition = ( id: number ) =>
⋮----
className=
````

## File: src/components/backgrounds/animated-grid-pattern/index.tsx
````typescript

````

## File: src/components/backgrounds/background-static/BackgroundStatic.tsx
````typescript
import React from 'react'
import { motion } from 'framer-motion'
export const BackgroundStatic = () =>
````

## File: src/components/backgrounds/background-static/index.tsx
````typescript

````

## File: src/components/backgrounds/dot-gradient/dot-gradient.tsx
````typescript
export function DotGradientBackground(
````

## File: src/components/backgrounds/graph-paper/graph-paper-bg.tsx
````typescript
import { useCustomCursor } from '@/hooks/use-custom-cursor'
import React from 'react'
⋮----
interface GraphPaperBackgroundProps {
  children?: React.ReactNode
}
export const GraphPaperBackground = (
````

## File: src/components/backgrounds/graph-paper/index.tsx
````typescript

````

## File: src/components/backgrounds/matrix-background/index.tsx
````typescript

````

## File: src/components/backgrounds/matrix-background/MatrixBackground.tsx
````typescript
import React, { useEffect, useRef } from 'react'
interface MatrixBackgroundProps {
  color?: string
  fontSize?: number
  className?: string
  speed?: number
}
export const MatrixBackground: React.FC<MatrixBackgroundProps> = ({
  color = '#0F0',
  fontSize = 14,
  className = '',
  speed = 1,
}) =>
⋮----
const resizeCanvas = () =>
⋮----
const draw = (currentTime: number) =>
````

## File: src/components/backgrounds/shooting-stars/index.tsx
````typescript

````

## File: src/components/backgrounds/shooting-stars/shooting-stars-background.tsx
````typescript
import React, { memo } from 'react'
import { ShootingStars } from './ShootingStars'
import { StarsBackground } from './stars-background'
````

## File: src/components/backgrounds/shooting-stars/ShootingStars.tsx
````typescript
import { cn } from '@/utils'
import React, { useEffect, useState, useRef } from 'react'
interface ShootingStar {
  id: number
  x: number
  y: number
  angle: number
  scale: number
  speed: number
  distance: number
}
interface ShootingStarsProps {
  minSpeed?: number
  maxSpeed?: number
  minDelay?: number
  maxDelay?: number
  starColor?: string
  trailColor?: string
  starWidth?: number
  starHeight?: number
  className?: string
}
const getRandomStartPoint = () =>
export const ShootingStars: React.FC<ShootingStarsProps> = ( {
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1200,
  maxDelay = 4200,
  starColor = '#9E00FF',
  trailColor = '#2EB9DF',
  starWidth = 10,
  starHeight = 1,
  className,
} ) =>
⋮----
const createStar = () =>
⋮----
const moveStar = () =>
⋮----
className=
⋮----
width=
⋮----
transform=
````

## File: src/components/backgrounds/shooting-stars/stars-background.tsx
````typescript
import { cn } from '@/utils'
import React, {
  useState,
  useEffect,
  useRef,
  RefObject,
  useCallback,
} from 'react'
interface StarProps {
  x: number
  y: number
  radius: number
  opacity: number
  twinkleSpeed: number | null
}
export const Star: React.FC<StarProps> = (
interface StarsBackgroundProps {
  starDensity?: number
  allStarsTwinkle?: boolean
  twinkleProbability?: number
  minTwinkleSpeed?: number
  maxTwinkleSpeed?: number
  className?: string
}
export const StarsBackground: React.FC<StarsBackgroundProps> = ( {
  starDensity = 0.00015,
  allStarsTwinkle = true,
  twinkleProbability = 0.7,
  minTwinkleSpeed = 0.5,
  maxTwinkleSpeed = 1,
  className,
} ) =>
⋮----
const updateStars = () =>
⋮----
className=
````

## File: src/components/backgrounds/backgrounds.tsx
````typescript
import { Spotlight } from '@/components/animated'
import { g, type d } from '@liveblocks/react/dist/suspense-fYGGJ3D9'
import { svg } from 'd3'
import { motion } from 'framer-motion'
import path from 'path'
import React, { useRef } from 'react'
import type { fill } from 'three/src/extras/TextureUtils'
export function FarmUIBackground()
````

## File: src/components/backgrounds/dot-grid-background.tsx
````typescript
import { cn } from '@/utils'
export function DotGridBackground(
export function DotGridBackgroundBlack(
export function DotGridBackgroundWhite(
````

## File: src/components/backgrounds/dot-pattern.tsx
````typescript
import React, { useId } from 'react'
import { cn } from '@/utils/cn'
interface DotPatternProps {
  width?: any
  height?: any
  x?: any
  y?: any
  cx?: any
  cy?: any
  cr?: any
  className?: string
  [key: string]: any
}
export function DotPattern( {
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  ...props
}: DotPatternProps )
⋮----
className=
````

## File: src/components/backgrounds/grain.tsx
````typescript
import { motion } from 'framer-motion'
````

## File: src/components/backgrounds/grid-background.tsx
````typescript
import React from "react";
export function GridBackgroundSmall(
export function GridBackground(
````

## File: src/components/backgrounds/index.tsx
````typescript

````

## File: src/components/backgrounds/meteors.tsx
````typescript
import { cn } from '@/utils'
import React from 'react'
⋮----
className=
````

## File: src/components/backgrounds/shader-bg.tsx
````typescript
import React from 'react'
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient'
````

## File: src/components/backgrounds/stars-background.tsx
````typescript
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/utils/cn'
````

## File: src/components/blockquote/Blockquote.tsx
````typescript
import { BlurAppear } from '@/components/animated/animated-wrappers'
import { TextEffect } from '@/components/animated/text-effect'
import { AvatarImage } from '@/components/ui/avatar'
import { QuoteIcon } from 'lucide-react'
export const BlockQuote = ( {
  quote,
  author,
  children,
}: {
  quote: string
  author: string
  children?: any
} ) =>
````

## File: src/components/blockquote/index.tsx
````typescript

````

## File: src/components/blocks/DropdownCard.tsx
````typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
````

## File: src/components/blocks/LinkCardGrid.tsx
````typescript
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  ContactRound,
  Hand,
  Server,
  UserCircle,
} from "lucide-react";
⋮----
className=
````

## File: src/components/blocks/LinkCards.tsx
````typescript
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
````

## File: src/components/bottom-drawer/BottomDrawer.stories.tsx
````typescript
import type {Meta, StoryObj} from '@storybook/react'
import {BottomDrawer} from './BottomDrawer'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/bottom-drawer/BottomDrawer.tsx
````typescript
import {Sheet} from '@silk-hq/components'
⋮----
const BottomDrawer = ()
````

## File: src/components/bottom-drawer/index.tsx
````typescript

````

## File: src/components/cult-ui/expandable-card/card.tsx
````typescript
import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Badge,
  Battery,
  Bluetooth,
  Calendar,
  Clock,
  Cloud,
  Droplets,
  Fingerprint,
  MapPin,
  MessageSquare,
  Mic,
  ShoppingCart,
  Star,
  Sun,
  Users,
  Video,
  Wind,
} from "lucide-react"
import { toast } from "sonner"
import {
  Expandable,
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardFooter,
  ExpandableCardHeader,
  ExpandableContent,
  ExpandableTrigger,
} from "./expandable"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
⋮----
Add to Cart
                  </Button>
                </div>
              </ExpandableContent>
            </ExpandableCardContent>
            <ExpandableContent preset="slide-up">
              <ExpandableCardFooter>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 w-full">
                  <span>Free shipping</span>
                  <span>30-day return policy</span>
                </div>
              </ExpandableCardFooter>
            </ExpandableContent>
          </ExpandableCard>
        </ExpandableTrigger>
      )}
    </Expandable>
  )
}
export function WeatherForecastCard()
⋮----
<span>{70 + index}°F</span>
                    </div>
                  </div>
                ) )}
              </div>
            </ExpandableContent>
          </ExpandableCardContent>
          <ExpandableCardFooter>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Last updated: 5 minutes ago
            </p>
          </ExpandableCardFooter>
        </ExpandableCard>
      </ExpandableTrigger>
    </Expandable>
  )
}
export function ControlledExpandableCard()
const [isExpanded, setIsExpanded] = useState( false )
⋮----
onExpandEnd=
````

## File: src/components/cult-ui/expandable-card/expandable.tsx
````typescript
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  AnimatePresence,
  HTMLMotionProps,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion"
import useMeasure from "react-use-measure"
import { cn } from "@/utils"
⋮----
interface ExpandableContextType {
  isExpanded: boolean
  toggleExpand: () => void
  expandDirection: "vertical" | "horizontal" | "both"
  expandBehavior: "replace" | "push"
  transitionDuration: number
  easeType: string
  initialDelay: number
  onExpandEnd?: () => void
  onCollapseEnd?: () => void
}
⋮----
const useExpandable = ()
type ExpandablePropsBase = Omit<HTMLMotionProps<"div">, "children">
interface ExpandableProps extends ExpandablePropsBase {
  children: ReactNode | ( ( props: { isExpanded: boolean } ) => ReactNode )
  expanded?: boolean
  onToggle?: () => void
  transitionDuration?: number
  easeType?: string
  expandDirection?: "vertical" | "horizontal" | "both"
  expandBehavior?: "replace" | "push"
  initialDelay?: number
  onExpandStart?: () => void
  onExpandEnd?: () => void
  onCollapseStart?: () => void
  onCollapseEnd?: () => void
}
⋮----
interface AnimationProps {
  initial?: object
  animate?: object
  exit?: object
  transition?: object
}
⋮----
// Get the expansion state and toggle function from the ExpandableContext
⋮----
// Use useMeasure hook to get the dimensions of the content
⋮----
// Create motion values for width and height
⋮----
// Apply spring animation to the motion values
⋮----
// Effect to update the animated dimensions when expansion state changes
⋮----
// Handler for hover start event
const handleHover = () =>
// Handler for hover end event
const handleHoverEnd = () =>
⋮----
className=
````

## File: src/components/cult-ui/floating-panel/floating-panel.tsx
````typescript
import { AnimatePresence, MotionConfig, Variants, motion } from "framer-motion"
import { ArrowLeftIcon } from "lucide-react"
import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import { cn } from "@/utils"
⋮----
interface FloatingPanelContextType {
  isOpen: boolean
  openFloatingPanel: ( rect: DOMRect ) => void
  closeFloatingPanel: () => void
  uniqueId: string
  note: string
  setNote: ( note: string ) => void
  triggerRect: DOMRect | null
  title: string
  setTitle: ( title: string ) => void
}
⋮----
function useFloatingPanel()
function useFloatingPanelLogic()
⋮----
const openFloatingPanel = ( rect: DOMRect ) =>
const closeFloatingPanel = () =>
⋮----
interface FloatingPanelRootProps {
  children: React.ReactNode
  className?: string
}
export function FloatingPanelRoot( {
  children,
  className,
}: FloatingPanelRootProps )
interface FloatingPanelTriggerProps {
  children: React.ReactNode
  className?: string
  title?: string
}
⋮----
const handleClick = () =>
⋮----
const handleClickOutside = ( event: MouseEvent ) =>
⋮----
const handleKeyDown = ( event: KeyboardEvent ) =>
⋮----
className=
⋮----
const handleSubmit = ( e: React.FormEvent ) =>
⋮----
onChange=
````

## File: src/components/cult-ui/floating-panel/index.tsx
````typescript

````

## File: src/components/cult-ui/popover/index.tsx
````typescript

````

## File: src/components/cult-ui/popover/popover.tsx
````typescript
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { X } from "lucide-react";
import type React from "react";
import {
	createContext,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { cn } from "@/utils";
⋮----
function useClickOutside(
	ref: React.RefObject<HTMLElement>,
	handler: () => void,
)
⋮----
const handleClickOutside = (event: MouseEvent) =>
⋮----
interface PopoverContextType {
	isOpen: boolean;
	openPopover: () => void;
	closePopover: () => void;
	uniqueId: string;
	note: string;
	setNote: (note: string) => void;
}
⋮----
function usePopover()
function usePopoverLogic()
⋮----
const openPopover = ()
const closePopover = () =>
⋮----
interface PopoverRootProps {
	children: React.ReactNode;
	className?: string;
}
export function PopoverRoot(
⋮----
className=
⋮----
interface PopoverTriggerProps {
	children: React.ReactNode;
	className?: string;
}
export function PopoverTrigger(
interface PopoverContentProps {
	children: React.ReactNode;
	className?: string;
}
⋮----
const handleKeyDown = (event: KeyboardEvent) =>
⋮----
const handleSubmit = (e: React.FormEvent) =>
````

## File: src/components/cult-ui/sortable-list/index.tsx
````typescript

````

## File: src/components/cult-ui/index.tsx
````typescript

````

## File: src/components/cursors/index.tsx
````typescript
import { NeonCursor } from '@/components/cursors/neon-cursor'
import { GooeyCursor } from '@/components/cursors/mindmap-cursor'
export const MindMapCursor = (
````

## File: src/components/cursors/mindmap-cursor.tsx
````typescript
import AnimatedCursor from 'react-animated-cursor'
export const GooeyCursor: React.FC = () =>
⋮----
xmlns='http://www.w3.org/2000/svg'
````

## File: src/components/cursors/neon-cursor.tsx
````typescript
import { useState, useEffect, useCallback } from 'react'
import { motion, useAnimation } from 'framer-motion'
⋮----
const handleMouseDown = ()
const handleMouseUp = ()
````

## File: src/components/decorative/rulers/ruler-ticks.tsx
````typescript
export const RulerTicks = (
````

## File: src/components/dock/Card/index.tsx
````typescript
import styles from './styles.module.scss'
interface CardProps {
  src: string
}
export const Card = (
````

## File: src/components/dock/Card/styles.module.scss
````scss
.card {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  & img {
    width: 50%;
    height: 50%;
    border-radius: 50%;
  }
  &__blur {
    position: absolute;
    z-index: 1;
    opacity: 0.4;
    filter: blur(10px);
    transform: translateY(10px) scale(1.25);
  }
  &__img {
    position: relative;
    z-index: 0;
  }
}
````

## File: src/components/dock/Dock/DockContext.ts
````typescript
import { createContext, useContext } from 'react'
import { SpringValue } from '@react-spring/web'
type DockApi = {
  hovered: boolean
  width: number
  zoomLevel?: SpringValue
  setIsZooming: (isZooming: boolean) => void
}
⋮----
export const useDock = () =>
````

## File: src/components/dock/Dock/index.tsx
````typescript
import { animated, useSpringValue } from '@react-spring/web'
import { clamp } from '@react-spring/shared'
import { useWindowResize } from '../hooks/useWindowResize'
import { DockContext } from './DockContext'
import styles from './styles.module.scss'
interface DockProps {
  children: React.ReactNode
}
⋮----
export const Dock = (
````

## File: src/components/dock/Dock/styles.module.scss
````scss
.dock {
  position: fixed;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  align-items: flex-end;
  height: 58px;
  display: flex;
  padding: 10px;
  padding-bottom: 6px;
  gap: 12px;
  background-color: rgba(0, 0, 0, 0.92);
  will-change: contents;
  box-sizing: content-box;
  border-radius: 12px;
  transform-origin: center bottom;
}
````

## File: src/components/dock/DockCard/index.tsx
````typescript
import { animated, useIsomorphicLayoutEffect, useSpringValue } from '@react-spring/web'
import { useMousePosition } from '../hooks/useMousePosition'
import { useWindowResize } from '../hooks/useWindowResize'
import { useDock } from '../Dock/DockContext'
import styles from './styles.module.scss'
interface DockCardProps {
  children: React.ReactNode
}
⋮----
export const DockCard = (
⋮----
const handleClick = () =>
````

## File: src/components/dock/DockCard/styles.module.scss
````scss
.dock-card {
  border-radius: 12px;
  border: solid 1px rgba(255, 255, 255, 0.1);
  background-color: #262626;
  filter: saturate(0.9) brightness(0.9);
  transition: filter 200ms;
  padding: 0;
  margin: 0;
  cursor: pointer;
  &:hover {
    filter: saturate(1) brightness(1.12);
  }
}
.dock-card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.dock-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #fff;
}
````

## File: src/components/dock/DockDivider/index.tsx
````typescript
import { useGesture } from '@use-gesture/react'
import { useDock } from '../Dock/DockContext'
import { DOCK_ZOOM_LIMIT } from '../Dock'
import styles from './styles.module.scss'
export const DockDivider = () =>
````

## File: src/components/dock/DockDivider/styles.module.scss
````scss
.divider {
  width: 1px;
  height: 100%;
  border-radius: 2px;
  background-color: rgba(255, 255, 255, 0.1);
  &__container {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 4px;
    &:hover {
      cursor: ns-resize;
    }
  }
}
````

## File: src/components/dock/hooks/useCallbackRef.ts
````typescript
function useCallbackRef<T extends (...args: any[]) => any>(callback: T | undefined): T
````

## File: src/components/dock/hooks/useMousePosition.ts
````typescript
import { useSpring, UseSpringProps } from '@react-spring/web'
import { useEffect, useMemo } from 'react'
export const useMousePosition = (springProps?: UseSpringProps, springDeps?: readonly any[]) =>
⋮----
const handleMouseMove = (event: MouseEvent) =>
````

## File: src/components/dock/hooks/useWindowResize.ts
````typescript
import { useCallbackRef } from './useCallbackRef'
export const useWindowResize = (callback: (width: number, height: number) => void) =>
⋮----
const handleResize = () =>
````

## File: src/components/dock/index.tsx
````typescript
import { FunctionComponent } from 'react'
import { DockCard } from './DockCard'
import { DockDivider } from './DockDivider'
import { Card } from './Card'
import { Dock } from './Dock'
interface DockMenuProps {}
````

## File: src/components/draggable-stack/DraggableStack.tsx
````typescript
import {clx} from '@/lib/utils/clx/clx-merge'
import {motion} from 'framer-motion'
import {useState} from 'react'
import {twMerge} from 'tailwind-merge'
⋮----
type TDragCard = {
  containerRef: React.RefObject<HTMLDivElement>
  src: string
  alt: string
  top: string
  left: string
  rotate: string
  className: string
}
⋮----
className=
⋮----
const updateZIndex_ = (setZIndex: React.Dispatch<React.SetStateAction<number>>) =>
````

## File: src/components/draggable-stack/index.tsx
````typescript

````

## File: src/components/drawers/drawer-underlay.stories.tsx
````typescript
import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {DemoDrawerUnderlay} from './drawer-underlay'
import {userEvent, within} from '@storybook/test'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/drawers/drawer-underlay.tsx
````typescript
import {ChevronsUpDown, Heart, Lock, Plus, Share, Wand2, X} from 'lucide-react'
import {motion, useAnimation, useMotionValue, useTransform} from 'framer-motion'
⋮----
const onDragAdjustHeight = (_event: unknown, info:
const onDragEndAdjustHeight = async () =>
const openSheet = () =>
const closeSheet = () =>
⋮----
// TODO
````

## File: src/components/earth/Earth.tsx
````typescript
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import type React from "react";
import { Suspense, memo, useRef } from "react";
⋮----
import { TextureLoader } from "three/src/loaders/TextureLoader";
type RotatingComponentProps = {};
````

## File: src/components/earth/index.tsx
````typescript

````

## File: src/components/file-upload/index.tsx
````typescript
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, Upload, X } from "lucide-react";
export default function FileUpload04()
````

## File: src/components/glitch-fx/GlitchFx.stories.tsx
````typescript
import type {Meta, StoryObj} from '@storybook/react'
import {GlitchFx} from './GlitchFx'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/glitch-fx/GlitchFx.tsx
````typescript
import type React from 'react'
import {useEffect, useState, forwardRef, useCallback} from 'react'
import styles from './GlitchFx.module.css'
import classNames from 'classnames'
interface GlitchFxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  speed?: 'slow' | 'medium' | 'fast'
  interval?: number
  trigger?: 'instant' | 'hover' | 'custom'
  continuous?: boolean
}
⋮----
const handleMouseEnter = () =>
const handleMouseLeave = () =>
⋮----
className=
````

## File: src/components/glitch-fx/index.tsx
````typescript

````

## File: src/components/globe/Globe.tsx
````typescript
import {useState, useEffect} from 'react'
import {getSightingsBatched} from '@/services/sightings/actions/sightings-time-chunk'
import {renderPoints, useTimeSeriesWithAggregation, type ClusterData} from './GlobePointsRenderer'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
interface GlobeProps {
  initialYear?: number
  endYear?: number
  maxSightings?: number
}
⋮----
async function fetchData()
⋮----
function handleZoomChange(distance: number)
function generateClusters(data: ValidatedUAPSighting[]): ClusterData[]
````

## File: src/components/globe/GlobePointsRenderer.tsx
````typescript
import {useState, useRef, useEffect, useCallback} from 'react'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {
  getZoomConfig,
  type ZOOM_LEVEL_CONFIG,
} from '@/services/sightings/actions/sightings-time-chunk'
import {xata} from '@/db/xata/client'
export interface ClusterData {
  count: number
  longitude?: number
  latitude?: number
  id: string
  [key: string]: any
}
type ClusterLayerProps = {
  clusters: ClusterData[]
}
type PointsLayerProps = {
  points: ValidatedUAPSighting[]
}
interface TimeSeriesDataPoint {
  date: Date
  count: number
}
export function ClusterLayer(
export function PointsLayer(
⋮----
async function fetchTimeData()
⋮----
const animate = () =>
````

## File: src/components/globes/cobe-globes/alt-globe.tsx
````typescript
import {animate, createTimeline} from 'animejs'
⋮----
import {geoMercator, geoPath, select} from 'd3'
import Image from 'next/image'
import {useEffect, useRef, useState} from 'react'
import globeLight from './globe-light.svg'
import globe2 from './globe.svg'
⋮----
const animate = () =>
⋮----
const toggleDarkMode = () =>
````

## File: src/components/globes/cobe-globes/artifact-sphere-animation.tsx
````typescript
import { cn } from "@/lib/utils";
import anime from "animejs";
import { useEffect, useMemo, useRef } from "react";
interface SphereAnimationProps {
	className?: string;
	colorScheme?: "default";
}
⋮----
const fitElementToParent = (
		el: SVGElement | HTMLElement,
		padding: number,
) =>
````

## File: src/components/globes/cobe-globes/cobe-globe.tsx
````typescript
import { cn } from '@/utils'
import createGlobe, { COBEOptions } from 'cobe'
import { useCallback, useEffect, useRef } from 'react'
import { useSpring } from 'react-spring'
⋮----
const updatePointerInteraction = ( value: any ) =>
const updateMovement = ( clientX: any ) =>
⋮----
const onResize = () =>
````

## File: src/components/globes/cobe-globes/globe-light.svg
````
<svg width="1015" height="679" viewBox="0 0 1015 679" fill="none" xmlns="http://www.w3.org/2000/svg"
  id='svg-globe-light'>
  <mask id="mask0_1015_5349" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1109" height="679">
    <rect width="1108.46" height="678.381" fill="url(#paint0_linear_1015_5349)" />
  </mask>
  <g mask="url(#mask0_1015_5349)">
    <path opacity="0.6"
      d="M284.212 934.142C280.085 931.625 287.602 910.243 305.952 872.103C324.301 833.964 352.861 780.429 388.746 716.858C424.631 653.288 466.583 581.947 510.388 510.018C554.212 438.055 598.338 368.056 638.316 306.983C678.328 245.929 712.797 195.99 738.253 162.201C763.727 128.377 779.293 111.913 783.42 114.429M223.942 890.748C206.799 876.243 204.265 845.057 216.571 800.328C228.912 755.618 255.695 698.895 294.208 635.931C332.721 572.966 381.657 505.952 436.047 441.654C490.456 377.32 548.395 317.956 604.05 269.496C659.74 221.056 711.177 185.21 753.226 165.621C795.275 146.032 826.45 143.356 843.612 157.827M165.144 831.521C140.432 801.853 133.219 758.546 144.163 705.919C155.106 653.291 183.898 593.193 227.587 531.665C271.276 470.137 328.344 409.347 393.061 355.408C457.777 301.47 527.862 256.307 596.229 224.428C664.631 192.568 728.912 175.084 782.685 173.773C836.439 172.497 877.751 187.397 902.43 217.046M108.278 746.185C84.1919 700.022 80.1842 644.392 96.6797 584.921C113.175 525.45 149.591 464.24 202.217 407.406C254.877 350.59 321.902 300.18 396.587 261.209C471.273 222.239 551.007 196.178 627.719 185.507C704.466 174.855 775.499 180.074 833.689 200.575C891.879 221.075 935.197 256.224 959.283 302.388M63.2587 618.573C51.0729 557.773 60.8435 493.669 91.5878 432.724C122.332 371.778 172.956 316.122 238.399 271.391C303.842 226.659 381.771 194.386 464.363 177.817C546.956 161.249 631.302 161.015 708.931 177.084C786.56 193.153 854.718 224.982 906.566 269.36C958.414 313.737 992.137 369.159 1004.32 429.959M61.6666 438.31C73.7976 371.655 107.536 310.171 159.503 260.022C211.436 209.854 279.764 172.788 357.63 152.518C435.477 132.281 520.09 129.545 602.963 144.663C685.855 159.747 764.079 192.136 829.76 238.535C895.442 284.935 946.351 343.703 977.257 408.969C1008.16 474.236 1018.08 543.656 1005.95 610.311M145.542 242.236C206.679 158.103 306.195 107.095 422.246 100.482C538.297 93.8692 661.331 132.188 764.297 206.972C867.262 281.755 941.754 386.946 971.341 499.316C1000.91 611.719 983.211 722.13 922.108 806.282M293.978 108.588C379.356 59.3404 486.517 55.8759 591.871 99.0185C697.226 142.161 792.142 228.286 855.726 338.559C919.33 448.797 946.407 574.1 930.978 686.894C915.549 799.688 858.929 890.731 773.551 939.978M439.48 53.7409C524.234 36.7562 615.444 70.0234 693.07 146.277C770.695 222.53 828.331 335.428 853.355 460.221C878.38 585.013 868.671 711.448 826.435 811.692C784.199 911.935 712.848 977.82 628.093 994.805M555.09 44.8675C623.422 47.9132 686.725 101.346 731.061 193.385C775.398 285.423 797.1 408.595 791.491 535.735C785.829 662.89 753.288 783.609 700.958 871.375C648.628 959.141 580.862 1006.76 512.531 1003.71M645.119 57.4993C689.588 68.0899 720.485 127.468 731.049 222.491C741.613 317.514 730.965 440.464 701.419 564.283C671.892 688.067 625.89 802.614 573.578 882.664C521.265 962.714 466.897 1001.74 422.447 991.113M718.855 81.4982C737.224 89.1837 735.308 143.186 713.586 231.644C691.863 320.102 652.105 435.78 603.026 553.199C553.948 670.618 499.6 780.216 451.876 857.828C404.204 935.425 367.102 974.739 348.732 967.054M369.476 975.209C322.633 958.135 277.147 932.876 237.891 902.139M544.474 1004.07C470.56 1005.74 384.012 981.709 304.334 937.463C224.655 893.217 158.558 832.439 120.849 768.829M658.841 987.629C564.847 1013 433.568 987.668 313.518 921.004C193.468 854.339 102.566 756.296 74.4161 663.095M753.898 950.718C704.348 976.293 637.105 984.632 561.094 974.627C485.083 964.622 403.798 936.776 328.102 894.742C252.405 852.707 185.78 798.462 137.125 739.195C88.451 679.961 59.9831 618.474 55.4986 562.894M834.454 898.345C786.032 937.256 711.598 954.582 623.226 947.505C534.855 940.428 437.749 909.367 347.703 859.363C257.656 809.36 179.957 743.351 127.234 672.078C74.511 600.805 49.8703 528.462 57.3034 466.789M901.137 833.101C857.568 884.949 779.486 911.837 681.878 908.614C584.251 905.425 473.891 872.349 371.966 815.75C270.042 759.151 183.626 682.956 129.31 601.771C74.9953 520.585 56.5431 440.091 77.5038 375.734M953.355 757.266C929.888 799.525 887.463 830.224 830.34 846.384C773.183 862.524 703.376 863.51 627.868 849.203C552.36 834.896 473.851 805.852 400.18 764.942C326.509 724.032 260.353 672.743 208.293 616.211C156.233 559.678 120.134 499.882 103.654 442.851C87.1399 385.801 90.8256 333.545 114.273 291.319M953.355 757.266C891.57 868.527 788.086 950.704 665.71 985.694C543.334 1020.68 412.103 1005.62 300.807 943.814C189.545 882.03 107.368 778.545 72.359 656.203C37.369 533.827 52.4358 402.597 114.239 291.3C176.023 180.039 279.508 97.8617 401.85 62.8527C524.226 27.8627 655.457 42.9295 766.753 104.733C878.015 166.517 960.191 270.001 995.201 392.343C1030.19 514.72 1015.14 646.004 953.355 757.266ZM990.124 672.851C974.107 722.078 935.765 759.58 879.502 781.067C823.257 802.52 751.414 807.092 672.207 794.189C592.98 781.321 509.601 751.504 431.673 708.23C353.71 664.937 284.358 609.941 231.553 549.492C178.749 489.043 144.598 425.657 133.11 366.592C121.588 307.508 133.188 255.155 166.491 215.484M1010.24 581.792C1003.58 636.891 971.662 680.7 918.684 707.515C865.686 734.364 794.057 742.917 713.229 732.124C632.401 721.331 546.116 691.651 465.682 646.986C385.248 602.321 314.442 544.766 262.552 481.86C210.662 418.955 180.058 353.631 174.833 294.451C169.607 235.27 189.923 185.017 233.155 150.275M1012.13 485.691C1016.94 545.223 993.958 594.851 946.686 627.08C899.414 659.31 830.418 672.424 750.067 664.411C669.716 656.398 582.42 627.73 501.334 582.702C420.248 537.675 349.731 478.709 300.488 414.758C251.211 350.788 225.869 285.287 228.238 228.123C230.607 170.958 260.622 125.238 313.662 97.8285M993.212 385.49C1012 447.754 1001.16 502.688 962.593 540.603C924.021 578.517 860.21 596.936 782.442 592.603C704.708 588.289 618.053 561.459 537.859 516.927C457.666 472.395 389.117 413.04 344.329 349.317C299.575 285.613 281.477 221.709 293.271 168.925C305.065 116.141 345.989 77.8714 408.753 60.9367M946.711 279.718C983.745 342.279 990.263 402.448 964.795 447.099C939.326 491.75 883.959 517.284 810.803 518.072C737.628 518.895 652.572 494.929 574.232 451.426C495.892 407.924 430.586 348.392 392.602 285.843C354.618 223.293 347.005 162.831 371.444 117.608C395.883 72.385 450.402 46.1115 523.085 44.4766M829.684 146.461C882.115 187.524 920.325 235.916 937.318 282.722C954.276 329.508 948.853 371.547 921.985 401.004C895.118 430.46 848.685 445.325 791.242 442.891C733.799 440.457 669.278 420.843 609.648 387.73C549.983 354.598 499.26 310.217 466.829 262.742C434.397 215.268 422.469 167.996 433.271 129.618C444.072 91.2397 476.856 64.3944 525.57 54.0759C574.25 43.7383 635.561 50.6109 698.133 73.4103M894.319 323.837C878.23 352.811 842.706 369.466 795.622 370.135C748.504 370.784 693.679 355.386 643.181 327.344C592.648 299.283 550.595 260.884 526.273 220.564C501.917 180.224 497.291 141.319 513.399 112.31C529.489 83.336 565.013 66.6812 612.096 66.0124C659.214 65.3626 714.039 80.7606 764.538 108.803C815.036 136.845 857.123 175.263 881.445 215.583C905.767 255.904 910.408 294.863 894.319 323.837ZM844.944 269.425C833.983 289.164 809.816 300.492 777.771 300.933C745.726 301.374 708.37 290.916 674.006 271.833C639.642 252.751 610.998 226.604 594.451 199.135C577.886 171.701 574.727 145.198 585.688 125.458C596.649 105.719 620.816 94.3906 652.861 93.9496C684.906 93.5087 722.263 103.967 756.626 123.049C790.99 142.132 819.634 168.279 836.181 195.748C852.746 223.182 855.906 249.685 844.944 269.425ZM787.916 221.273C776.364 242.076 737.618 242.614 701.366 222.483C665.114 202.352 645.088 169.178 656.64 148.374C668.192 127.571 706.939 127.033 743.191 147.164C779.443 167.295 799.468 200.469 787.916 221.273Z"
      stroke="#27F1FF" strokeWidth="1.39595" />
    <path
      d="M370.959 -86.196C445.718 -61.1233 503.129 -2.39663 533.355 44.4572C268.571 45.0287 54.0444 259.625 53.5867 524.437C-0.277672 503.261 -39.8209 473.121 -64.9804 436.382C-90.2599 399.468 -101.045 355.852 -97.2083 307.885C-89.5332 211.924 -23.3326 98.5279 102.442 -13.2713C202.961 -102.622 295.778 -111.41 370.959 -86.196Z"
      fill="url(#paint1_radial_1015_5349)" fill-opacity="0.08" stroke="url(#paint2_radial_1015_5349)"
      strokeWidth="1.15887" />
  </g>
  <defs>
    <linearGradient id="paint0_linear_1015_5349" x1="446.14" y1="-76.7441" x2="689.505" y2="372.509"
      gradientUnits="userSpaceOnUse">
      <stop stop-color="#27F1FF" />
      <stop offset="1" stop-color="#27F1FF" stop-opacity="0" />
    </linearGradient>
    <radialGradient id="paint1_radial_1015_5349" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate(298.542 248.772) rotate(-132.571) scale(228.667 229.067)">
      <stop stop-color="#27F1FF" />
      <stop offset="1" stop-color="#27F1FF" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="paint2_radial_1015_5349" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate(236.37 188.573) rotate(-113.962) scale(136.073 280.182)">
      <stop stop-color="#27F1FF" />
      <stop offset="1" stop-color="#27F1FF" stop-opacity="0" />
    </radialGradient>
  </defs>
</svg>
````

## File: src/components/globes/cobe-globes/globe.svg
````
<svg width="1015" height="679" viewBox="0 0 1015 679" fill="none" xmlns="http://www.w3.org/2000/svg">
  <mask id="mask0_1015_5349" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1109" height="679">
    <rect width="1108.46" height="678.381" fill="url(#paint0_linear_1015_5349)" />
  </mask>
  <g mask="url(#mask0_1015_5349)">
    <path opacity="0.6"
      d="M284.212 934.142C280.085 931.625 287.602 910.243 305.952 872.103C324.301 833.964 352.861 780.429 388.746 716.858C424.631 653.288 466.583 581.947 510.388 510.018C554.212 438.055 598.338 368.056 638.316 306.983C678.328 245.929 712.797 195.99 738.253 162.201C763.727 128.377 779.293 111.913 783.42 114.429M223.942 890.748C206.799 876.243 204.265 845.057 216.571 800.328C228.912 755.618 255.695 698.895 294.208 635.931C332.721 572.966 381.657 505.952 436.047 441.654C490.456 377.32 548.395 317.956 604.05 269.496C659.74 221.056 711.177 185.21 753.226 165.621C795.275 146.032 826.45 143.356 843.612 157.827M165.144 831.521C140.432 801.853 133.219 758.546 144.163 705.919C155.106 653.291 183.898 593.193 227.587 531.665C271.276 470.137 328.344 409.347 393.061 355.408C457.777 301.47 527.862 256.307 596.229 224.428C664.631 192.568 728.912 175.084 782.685 173.773C836.439 172.497 877.751 187.397 902.43 217.046M108.278 746.185C84.1919 700.022 80.1842 644.392 96.6797 584.921C113.175 525.45 149.591 464.241 202.217 407.406C254.877 350.59 321.902 300.18 396.587 261.209C471.273 222.239 551.007 196.178 627.719 185.507C704.466 174.855 775.499 180.074 833.689 200.575C891.879 221.075 935.197 256.224 959.283 302.388M63.2587 618.573C51.0729 557.773 60.8435 493.669 91.5878 432.724C122.332 371.778 172.956 316.122 238.399 271.391C303.842 226.659 381.771 194.386 464.363 177.817C546.956 161.249 631.302 161.015 708.931 177.084C786.56 193.153 854.718 224.982 906.566 269.36C958.414 313.737 992.137 369.159 1004.32 429.959M61.6666 438.31C73.7976 371.655 107.536 310.171 159.503 260.022C211.436 209.854 279.764 172.788 357.63 152.518C435.477 132.281 520.09 129.545 602.963 144.663C685.855 159.747 764.079 192.136 829.76 238.535C895.442 284.935 946.351 343.703 977.257 408.969C1008.16 474.236 1018.08 543.656 1005.95 610.311M145.542 242.236C206.679 158.103 306.195 107.095 422.246 100.482C538.297 93.8692 661.331 132.188 764.297 206.972C867.262 281.755 941.754 386.946 971.341 499.316C1000.91 611.719 983.211 722.13 922.108 806.282M293.978 108.588C379.356 59.3404 486.517 55.8759 591.871 99.0185C697.226 142.161 792.142 228.286 855.727 338.559C919.331 448.797 946.407 574.1 930.978 686.894C915.549 799.688 858.929 890.731 773.551 939.978M439.48 53.7409C524.234 36.7562 615.444 70.0234 693.07 146.277C770.695 222.53 828.331 335.428 853.355 460.221C878.38 585.013 868.671 711.448 826.435 811.692C784.199 911.935 712.848 977.82 628.093 994.804M555.09 44.8675C623.422 47.9132 686.725 101.346 731.062 193.385C775.398 285.423 797.1 408.595 791.491 535.735C785.829 662.89 753.288 783.609 700.958 871.375C648.628 959.141 580.862 1006.76 512.531 1003.71M645.119 57.4993C689.588 68.0899 720.485 127.468 731.049 222.491C741.613 317.514 730.965 440.464 701.419 564.283C671.892 688.067 625.89 802.614 573.578 882.664C521.265 962.714 466.897 1001.74 422.447 991.113M718.855 81.4982C737.224 89.1837 735.308 143.186 713.586 231.644C691.863 320.102 652.105 435.78 603.026 553.199C553.948 670.618 499.6 780.216 451.876 857.828C404.204 935.425 367.102 974.739 348.732 967.054M369.476 975.209C322.633 958.135 277.147 932.876 237.891 902.139M544.475 1004.07C470.56 1005.74 384.012 981.709 304.334 937.463C224.655 893.217 158.558 832.439 120.849 768.829M658.841 987.629C564.847 1013 433.568 987.668 313.518 921.004C193.468 854.339 102.566 756.296 74.4161 663.095M753.898 950.718C704.348 976.293 637.105 984.632 561.094 974.627C485.083 964.622 403.798 936.776 328.102 894.742C252.405 852.707 185.78 798.462 137.125 739.195C88.451 679.961 59.9831 618.474 55.4986 562.894M834.454 898.345C786.032 937.256 711.598 954.582 623.226 947.505C534.855 940.428 437.749 909.367 347.703 859.363C257.656 809.36 179.957 743.351 127.234 672.078C74.511 600.805 49.8703 528.462 57.3034 466.789M901.137 833.101C857.568 884.949 779.486 911.837 681.878 908.614C584.251 905.425 473.891 872.349 371.966 815.75C270.042 759.151 183.626 682.956 129.31 601.771C74.9953 520.585 56.5431 440.091 77.5038 375.734M953.355 757.266C929.888 799.525 887.463 830.224 830.34 846.384C773.183 862.524 703.376 863.51 627.868 849.203C552.36 834.896 473.851 805.852 400.18 764.942C326.509 724.032 260.353 672.743 208.293 616.211C156.233 559.678 120.134 499.882 103.654 442.851C87.1399 385.801 90.8256 333.545 114.273 291.319M953.355 757.266C891.57 868.527 788.086 950.704 665.71 985.694C543.334 1020.68 412.103 1005.62 300.807 943.814C189.545 882.03 107.368 778.545 72.359 656.203C37.369 533.827 52.4358 402.597 114.239 291.3C176.023 180.039 279.508 97.8617 401.85 62.8527C524.226 27.8627 655.457 42.9295 766.753 104.733C878.015 166.517 960.192 270.001 995.201 392.343C1030.19 514.72 1015.14 646.004 953.355 757.266ZM990.124 672.851C974.108 722.078 935.765 759.58 879.502 781.067C823.257 802.52 751.414 807.092 672.207 794.189C592.98 781.321 509.601 751.504 431.673 708.23C353.71 664.937 284.358 609.941 231.553 549.492C178.749 489.043 144.598 425.657 133.11 366.592C121.588 307.508 133.188 255.155 166.491 215.484M1010.24 581.792C1003.58 636.89 971.663 680.7 918.684 707.515C865.686 734.364 794.057 742.917 713.229 732.124C632.401 721.331 546.116 691.651 465.682 646.986C385.248 602.321 314.442 544.766 262.552 481.86C210.662 418.955 180.058 353.631 174.833 294.451C169.608 235.27 189.923 185.017 233.155 150.275M1012.13 485.691C1016.94 545.223 993.958 594.851 946.686 627.08C899.414 659.31 830.418 672.424 750.067 664.411C669.716 656.398 582.42 627.73 501.334 582.702C420.248 537.675 349.731 478.709 300.488 414.758C251.211 350.788 225.869 285.287 228.238 228.123C230.607 170.958 260.622 125.238 313.662 97.8285M993.212 385.49C1012 447.754 1001.16 502.688 962.593 540.603C924.022 578.517 860.21 596.936 782.442 592.603C704.708 588.289 618.053 561.459 537.859 516.927C457.666 472.395 389.117 413.04 344.329 349.317C299.575 285.613 281.477 221.709 293.271 168.925C305.065 116.141 345.989 77.8714 408.753 60.9367M946.711 279.718C983.745 342.279 990.263 402.448 964.795 447.099C939.326 491.75 883.959 517.284 810.803 518.072C737.628 518.895 652.572 494.929 574.232 451.426C495.892 407.924 430.586 348.392 392.602 285.843C354.618 223.293 347.005 162.831 371.444 117.608C395.883 72.385 450.402 46.1115 523.085 44.4766M829.684 146.461C882.115 187.524 920.325 235.916 937.318 282.722C954.276 329.508 948.853 371.547 921.985 401.004C895.118 430.46 848.685 445.325 791.242 442.891C733.799 440.457 669.278 420.843 609.648 387.73C549.983 354.598 499.26 310.217 466.829 262.742C434.397 215.268 422.469 167.996 433.271 129.618C444.072 91.2397 476.856 64.3944 525.57 54.0759C574.25 43.7383 635.561 50.6109 698.133 73.4103M894.319 323.837C878.23 352.811 842.706 369.466 795.622 370.135C748.504 370.784 693.679 355.386 643.181 327.344C592.648 299.283 550.595 260.884 526.273 220.564C501.917 180.224 497.291 141.319 513.399 112.31C529.489 83.336 565.013 66.6812 612.096 66.0124C659.214 65.3626 714.039 80.7606 764.538 108.803C815.036 136.845 857.123 175.263 881.445 215.583C905.767 255.904 910.409 294.863 894.319 323.837ZM844.944 269.425C833.983 289.164 809.816 300.492 777.771 300.933C745.726 301.374 708.37 290.916 674.006 271.833C639.642 252.751 610.998 226.604 594.451 199.135C577.886 171.701 574.727 145.198 585.688 125.458C596.649 105.719 620.817 94.3906 652.862 93.9496C684.907 93.5087 722.263 103.967 756.626 123.05C790.99 142.132 819.634 168.279 836.181 195.748C852.746 223.182 855.906 249.685 844.944 269.425ZM787.916 221.273C776.364 242.076 737.618 242.614 701.366 222.483C665.114 202.352 645.088 169.178 656.64 148.374C668.192 127.571 706.939 127.033 743.191 147.164C779.443 167.295 799.468 200.469 787.916 221.273Z"
      stroke="#cba6fa" strokeWidth="1.39595" />
    <path
      d="M533.355 44.4572C268.571 45.0287 54.0444 259.625 53.5867 524.437C-0.277672 503.261 -39.8209 473.121 -64.9804 436.382C-90.2599 399.468 -101.045 355.852 -97.2083 307.885C-89.5332 211.924 -23.3326 98.5279 102.442 -13.2713C202.961 -102.622 295.778 -111.41 370.959 -86.196C445.718 -61.1233 503.129 -2.39663 533.355 44.4572Z"
      fill="url(#paint1_radial_1015_5349)" fill-opacity="0.08" stroke="url(#paint2_radial_1015_5349)"
      strokeWidth="1.15887" />
  </g>
  <defs>
    <linearGradient id="paint0_linear_1015_5349" x1="446.14" y1="-76.7441" x2="689.505" y2="372.509"
      gradientUnits="userSpaceOnUse">
      <stop stop-color="#cba6fa" />
      <stop offset="1" stop-color="#cba6fa" stop-opacity="0" />
    </linearGradient>
    <radialGradient id="paint1_radial_1015_5349" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate(298.542 248.772) rotate(-132.571) scale(228.667 229.067)">
      <stop stop-color="white" />
      <stop offset="1" stop-color="#D9D9D9" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="paint2_radial_1015_5349" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate(236.37 188.573) rotate(-113.962) scale(136.073 280.182)">
      <stop stop-color="#D9D9D9" />
      <stop offset="1" stop-color="#D9D9D9" stop-opacity="0" />
    </radialGradient>
  </defs>
</svg>
````

## File: src/components/globes/cobe-globes/index.tsx
````typescript

````

## File: src/components/globes/index.tsx
````typescript

````

## File: src/components/graph-paper/graph-paper.stories.tsx
````typescript
import type { Meta, StoryObj } from '@storybook/react'
import { GraphPaper } from './GraphPaper'
⋮----
type Story = StoryObj<typeof GraphPaper>
````

## File: src/components/graph-paper/GraphPaper.tsx
````typescript
import { useEffect } from 'react'
⋮----
import { GraphPaperAnimation } from './main'
⋮----
href='https://twitter.com/fajjet'
````

## File: src/components/graph-paper/index.tsx
````typescript

````

## File: src/components/graph-paper/main.js
````javascript
drawPath(ctx, fn) {
ctx.save()
ctx.beginPath()
fn()
ctx.closePath()
ctx.restore()
⋮----
random(min, max, int) {
let result = min + Math.random() * (max + (int ? 1 : 0) - min)
return int ? parseInt(result) : result
⋮----
getVectorLength(p1, p2) {
return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2))
⋮----
easing(t, b, c, d, s) {
⋮----
cellEasing(t, b, c, d, s) {
⋮----
export class GraphPaperAnimation {
⋮----
time: Date.now(),
⋮----
dlt: performance.now(),
⋮----
this.bindNodes()
this.getDimensions()
⋮----
this.start()
⋮----
start() {
this.initEvents()
this.canvasInit()
this.loop()
this.initCheckingInterval()
this.splitText()
⋮----
splitText() {
ui.textNodes.forEach((el) => {
⋮----
el.innerHTML = value.split('').reduce((acc, cur) => {
⋮----
animateText() {
const callback = () => {
ui.social.classList.add('active')
ui.mouse.classList.add('active')
⋮----
ui.textNodes.forEach((el, elIndex) => {
el.classList.add('active')
const letters = el.querySelectorAll('.letter')
const length = Math.round(letters.length / 2) + 1
⋮----
setTimeout(() => {
if (letter1) letter1.classList.add('active')
if (letter2) letter2.classList.add('active')
⋮----
callback()
⋮----
getDimensions() {
⋮----
updatePlane() {
⋮----
const cell = Math.round(w / cfg.cell)
⋮----
const yPreSize = h / Math.round(cell * (h / w))
⋮----
plane.cells = [Math.round(w / plane.xCell), Math.round(h / plane.yCell)]
plane.xCenter = Math.round(plane.cells[1] / 2)
plane.yCenter = Math.round(plane.cells[0] / 2)
⋮----
bindNodes() {
⋮----
ui[selector] = document.querySelectorAll(ui[selector])
⋮----
canvasInit() {
⋮----
context.plane = ui.plane.getContext('2d')
⋮----
context.main = ui.main.getContext('2d')
⋮----
this.getTextPixels()
⋮----
initEvents() {
window.addEventListener('resize', (e) => {
⋮----
this.resizeHandler(e)
⋮----
document.addEventListener('mousemove', (e) => {
⋮----
document.addEventListener('mousedown', (e) => {
⋮----
document.addEventListener('mouseup', (e) => {
⋮----
document.addEventListener('contextmenu', (e) => {
e.preventDefault()
⋮----
this.resizeHandler()
⋮----
resizeHandler(e) {
⋮----
this.updatePlane()
this.updateTextConfig()
if (state.planeIsDrawn) this.getTextPixels()
⋮----
updateTextConfig() {
⋮----
initCheckingInterval() {
⋮----
setInterval(() => {
⋮----
loop() {
const loop = () => {
⋮----
state.time = Date.now()
ctx.clearRect(0, 0, doc.width, doc.height)
this.updateState()
this.draw()
⋮----
this.raf = requestAnimationFrame(loop)
⋮----
loop()
⋮----
updateState() {
⋮----
const now = performance.now()
⋮----
ui.mouse.classList.remove('active')
⋮----
const mp = tools.cellEasing(state.mousePower, 0, 1, 1)
⋮----
getTextPixels() {
⋮----
tools.drawPath(ctx, () => {
⋮----
const h = parseInt(ctx.font)
const w = ctx.measureText(text).width
⋮----
ctx.fillText(text, x, y)
⋮----
const imageData = ctx.getImageData(0, 0, doc.width, doc.height).data
⋮----
state.textPixelData.push({
⋮----
value: tools.random(0, 1, true),
⋮----
drawText() {
⋮----
const x = doc.width / 2 - ctx.measureText(text).width / 2
⋮----
const x2 = (3 + mp * 50) * Math.sin(p * i)
const y2 = (10 + mp * 50) * Math.cos(p * i)
⋮----
if (i % 2 === 0) ctx.fillText(value + '', x, y + y2 * -1)
⋮----
ctx.fillRect(x + x2, y, 5 * per * (1 - mp), 1)
ctx.fillRect(x, y + y2, 1, 5 * per * (1 - mp))
⋮----
draw() {
⋮----
this.startGeneratingGlitches()
this.startGeneratingLines()
this.startGeneratingNumbers()
⋮----
this.animateText()
⋮----
this.drawPlane()
⋮----
this.drawMouseMoveInteraction({ i, i2, x, y })
⋮----
this.drawMarkupYAnimation({ i, i2, x, y, cp })
⋮----
this.drawMarkupXAnimation({ i, i2, x, y, cp })
⋮----
this.drawGlitches()
this.drawAnimLines()
this.drawNumbersAnimation()
this.drawText()
⋮----
startGeneratingNumbers() {
⋮----
function generateItem() {
⋮----
tools.random(1 + 50 * (1 - mp), 5 + 100 * (1 - mp)) / state.area
⋮----
color: `rgba(255,255,255,${tools.random(0.01, 0.3)})`,
blinks: Array(tools.random(0, 3, true))
.fill(null)
.map((item) => {
⋮----
at: tools.random(0, 1),
dur: tools.random(0, 0.3),
⋮----
pf: tools.random(0.00075, 0.01),
x: tools.random(0, cells[0], true) * xCell,
y: tools.random(0, cells[1], true) * yCell,
⋮----
if (state.tabIsActive) state.animNumbers.push(item)
setTimeout(generateItem, timeToNewItem)
⋮----
generateItem()
⋮----
drawNumbersAnimation() {
⋮----
state.animNumbers.forEach((item, i) => {
⋮----
item.blinks.forEach((blink) => {
⋮----
const th = parseInt(ctx.font) || 18
const tw = ctx.measureText(item.value + '').width
⋮----
ctx.fillText(
⋮----
if (item.p >= 1) state.animNumbers.splice(i, 1)
⋮----
startGeneratingLines() {
⋮----
tools.random(25 + 80 * (1 - mp), 75 + 1200 * (1 - mp)) / state.area
⋮----
color: tools.random(0, 0.15),
pf: tools.random(0.0005, 0.00125),
⋮----
item.coord = tools.random(0, 1, true) ? 'x' : 'y'
item.length = tools.random(xCell * 2, state.area * xCell * 5)
item.dir = tools.random(0, 1, true) ? 1 : -1
item.distance = item.length * tools.random(1, 2)
if (state.tabIsActive) state.animLines.push(item)
⋮----
drawAnimLines() {
⋮----
state.animLines.forEach((line, i) => {
⋮----
const p = tools.easing(line.p, 0, 1, 1)
⋮----
ctx.fillRect(
⋮----
if (line.p >= 1) state.animLines.splice(i, 1)
⋮----
startGeneratingGlitches() {
⋮----
const timeToNewItem = tools.random(
⋮----
color: `rgba(255,255,255,${tools.random(0.01, 1)})`,
⋮----
.map((blink) => {
⋮----
pf: tools.random(0.0015, 0.0035),
⋮----
if (state.tabIsActive) state.glitches.push(item)
⋮----
drawGlitches() {
⋮----
state.glitches.forEach((glitch, i) => {
⋮----
glitch.blinks.forEach((blink) => {
⋮----
ctx.fillRect(glitch.x, glitch.y, glitch.width, glitch.height)
⋮----
if (glitch.p >= 1) state.glitches.splice(i, 1)
⋮----
drawMouseMoveInteraction(props) {
⋮----
const position = [Math.abs(i2 - xCenter), Math.abs(i - yCenter)]
⋮----
(200 + 50 * mp) * ((i * i2) % 2) * Math.sin(position[0] - position[1])
⋮----
const vector = tools.getVectorLength([x, y], [mouse.x, mouse.y])
⋮----
Math.sin(sp + i) *
⋮----
const yOffset = Math.cos(sp + i2) * spinRadius * ((Math.PI * 2) / 4)
⋮----
const vector2 = tools.getVectorLength([sx, sy], [mouse.x, mouse.y])
⋮----
ctx.moveTo(sx, sy)
ctx.lineTo(mouse.x, mouse.y)
ctx.stroke()
⋮----
ctx.moveTo(x, y)
ctx.lineTo(sx, sy)
⋮----
ctx.arc(x, y, 1, 0, 2 * Math.PI)
ctx.fill()
⋮----
ctx.arc(x, y, 3 + 10 * (1 - percent), 0, 2 * Math.PI)
⋮----
ctx.arc(sx, sy, 1, 0, 2 * Math.PI)
⋮----
ctx.arc(sx, sy, radius, 0, 2 * Math.PI)
⋮----
drawPlaneDotsAnimation(props) {
⋮----
ctx.fillRect(x - 1, y - 1, size, size)
⋮----
drawPlaneCenterLines(props) {
⋮----
drawYLines(props) {
⋮----
const pos = Math.abs(i - yCenter)
⋮----
const ef = tools.cellEasing(f, 0, 1, 1)
⋮----
ctx.fillRect(x, 0 + (doc.height / 2) * (1 - ef), 1, doc.height * ef)
⋮----
drawYMarkup(props) {
⋮----
x - ctx.measureText(text).width / 2,
⋮----
ctx.fillText(text, textCoords[0], textCoords[1] + (1 - f2) * -20)
⋮----
drawXLines(props) {
⋮----
const pos = Math.abs(i2 - xCenter)
⋮----
ctx.fillRect(0 + (doc.width / 2) * (1 - ef), y, doc.width * ef, 1)
⋮----
drawXMarkup(props) {
⋮----
drawPlane() {
⋮----
const p = tools.easing(state.planeProgress, 0, 1, 1)
⋮----
this.drawPlaneCenterLines({ p })
⋮----
this.drawPlaneDotsAnimation({ dp, i, i2, x, y })
⋮----
this.drawYLines({ i, i2, p, cp, x, y })
this.drawYMarkup({ i, p, cp, x, y })
⋮----
this.drawXLines({ i, i2, p, cp, x, y })
this.drawXMarkup({ i2, p, cp, x, y })
⋮----
drawMarkupYAnimation(props) {
⋮----
const spSin = Math.sin(state.markupOffset)
const sp = spSin >= 0 ? tools.cellEasing(Math.abs(spSin), 0, 1, 1) : 0
⋮----
ctx.fillText(text, textCoords[0], textCoords[1])
⋮----
drawMarkupXAnimation(props) {
⋮----
const sp = spSin <= 0 ? tools.cellEasing(Math.abs(spSin), 0, 1, 1) : 0
⋮----
ctx.fillText(xCenter - i2 + '', textCoords[0], textCoords[1])
````

## File: src/components/GridAnimation/GridAnimation.tsx
````typescript
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'
interface GridAnimationProps {
  className?: string
}
````

## File: src/components/GridAnimation/index.ts
````typescript

````

## File: src/components/hud-interface/AnimatedHudInterface.tsx
````typescript
import {useEffect, useRef, useState} from 'react'
import gsap from 'gsap'
import Zdog from 'zdog'
interface AnimatedHudInterfaceProps {
  className?: string
}
const AnimatedHudInterface = (
⋮----
const setup = () =>
const showButton = () =>
const showCube = () =>
const animate = () =>
const showBlob = () =>
const interfaceDataAnim = () =>
const bannerAnim = () =>
const reticuleAnim = () =>
const reticuleFade = () =>
const circlesAnim = () =>
const crossLinesAnim = () =>
const initTimeline = () =>
⋮----
const handleRestart = () =>
⋮----
xmlns='http://www.w3.org/2000/svg'
⋮----
xmlns='http://www.w3.org/2000/svg'
⋮----
xmlnsXlink='http://www.w3.org/1999/xlink'
````

## File: src/components/hud-interface/CardsPlayerHolo.stories.tsx
````typescript
import React from 'react'
import type {Meta, StoryObj} from '@storybook/react'
import CardsPlayerHolo from './CardsPlayerHolo'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/hud-interface/CardsPlayerHolo.tsx
````typescript
import {useEffect, useRef, useState} from 'react'
interface CardData {
  id: number
  image: string
  thumbnail: string
  music: string
  artist: string
  genre: string
  duration: number
}
interface CardsPlayerHoloProps {
  className?: string
  cardData?: CardData[]
}
⋮----
// State variables
⋮----
const formatTime = (seconds: number) =>
const setMusicTrack = (index: number) =>
const updateCards = (animate = true) =>
const navigatePrev = () =>
const navigateNext = () =>
const togglePlay = () =>
const toggleMute = () =>
const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
const updateProgress = () =>
const seekTrack = (e: React.MouseEvent<HTMLDivElement>) =>
const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) =>
const handleDrag = (e: React.MouseEvent<HTMLDivElement>) =>
const handleDragEnd = () =>
⋮----
const handleMouseMove = (e: MouseEvent) =>
const handleMouseUp = () =>
````

## File: src/components/hud-interface/CardsPlayerHolo2.stories.tsx
````typescript
import React from 'react'
import type {Meta, StoryObj} from '@storybook/react'
import CardsPlayerHolo2 from './CardsPlayerHolo2'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/hud-interface/CirclesHud.tsx
````typescript
import {useEffect, useRef} from 'react'
import gsap from 'gsap'
interface CirclesHudProps {
  className?: string
}
⋮----
// Make sure GSAP is loaded
⋮----
const initializeHUD = () =>
const animateTerminalText = () =>
const animateWireframe = () =>
const handleClick = () =>
````

## File: src/components/hud-interface/CirclesHud2.stories.tsx
````typescript
import type React from 'react'
import type {Meta, StoryObj} from '@storybook/react'
import CirclesHud2 from './CirclesHud2'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/hud-interface/CirclesHud2.tsx
````typescript
import {useEffect, useRef} from 'react'
import gsap from 'gsap'
interface CirclesHud2Props {
  className?: string
  colorScheme?: 'blue' | 'green' | 'purple'
}
⋮----
const getPrimaryColor = () =>
const getSecondaryColor = () =>
⋮----
const initializeHUD = () =>
const animateTerminalText = () =>
const animateWireframe = () =>
const handleClick = () =>
````

## File: src/components/hud-interface/CirclesHud3.stories.tsx
````typescript
import type React from 'react'
import type {Meta, StoryObj} from '@storybook/react'
import CirclesHud3 from '@/components/hud-interface/CirclesHud3'
type SystemStatus = {
  name: string
  status: 'online' | 'offline' | 'warning' | 'critical' | 'standby' | 'primed' | 'charged'
  value?: number
}
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/hud-interface/CirclesHud3.tsx
````typescript
import {useState, useEffect, useRef} from 'react'
import gsap from 'gsap'
interface SystemStatus {
  name: string
  status: 'online' | 'offline' | 'warning' | 'critical' | 'standby' | 'primed' | 'charged'
  value?: number
}
interface CirclesHud3Props {
  className?: string
  interactive?: boolean
  systemStatuses?: SystemStatus[]
}
⋮----
const getStatusColor = (status: string) =>
const handleTerminalSubmit = (e: React.FormEvent) =>
⋮----
// Make sure GSAP is loaded
⋮----
const initializeHUD = () =>
const animateWireframe = () =>
⋮----
const handleSystemSelect = (name: string) =>
⋮----
onChange=
````

## File: src/components/hud-interface/Dashboard1.stories.tsx
````typescript
import type {Meta, StoryObj} from '@storybook/react'
import Dashboard1 from './Dashboard1'
⋮----
type Story = StoryObj<typeof Dashboard1>
````

## File: src/components/hud-interface/Dashboard1.tsx
````typescript
import HudDash from './HudDash'
interface Dashboard1Props {
  className?: string
}
const Dashboard1: React.FC<Dashboard1Props> = (
````

## File: src/components/hud-interface/Dashboard2.stories.tsx
````typescript
import type {Meta, StoryObj} from '@storybook/react'
import Dashboard2 from './Dashboard2'
⋮----
type Story = StoryObj<typeof Dashboard2>
````

## File: src/components/hud-interface/Dashboard2.tsx
````typescript
import HudDash from './HudDash'
interface Dashboard2Props {
  className?: string
}
const Dashboard2: React.FC<Dashboard2Props> = (
````

## File: src/components/hud-interface/GlitchySurveillanceUi.tsx
````typescript
import {useState, useEffect, useRef} from 'react'
interface GlitchySurveillanceUiProps {
  className?: string
}
⋮----
const logEvent = (message: string) =>
const updateTime = () =>
const randomizeScanLines = () =>
const applyRandomGlitch = (index: number) =>
⋮----
// Log the glitch occasionally
⋮----
// Setup glitch effects for cameras
const setupGlitchEffects = () =>
⋮----
// Trigger an immediate glitch on startup
⋮----
}, Math.random() * 1000) // Random delay within first second
// Random glitch intervals for each camera
⋮----
const scheduleNextGlitch = () =>
⋮----
// 85% chance for a glitch
⋮----
// Setup reduced motion effects for accessibility
const setupReducedMotionEffects = () =>
⋮----
// Simplified, less intensive effects for reduced motion preference
⋮----
const scheduleMinimalGlitch = () =>
⋮----
const nextGlitchDelay = 8000 + Math.random() * 10000 // Much less frequent
⋮----
// Less likely to glitch
// Just apply a mild color shift or subtle effect
⋮----
// Mild color shift
⋮----
// Toggle between color/BW mode
const toggleFilter = () =>
// Toggle between grid layouts
const toggleGrid = () =>
const resetSystem = () =>
const triggerGlitch = () =>
⋮----
const getGridClass = () =>
````

## File: src/components/hud-interface/HudCard.stories.tsx
````typescript
import type React from 'react'
import type {Meta, StoryObj} from '@storybook/react'
import HudCard from './HudCard'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/hud-interface/HudCard.tsx
````typescript
import {useState, useEffect} from 'react'
interface HudCardProps {
  className?: string
}
const HudCard = (
⋮----
// Animation for floating effect
⋮----
// Optional: Add any initialization here
````

## File: src/components/hud-interface/HudCard2.stories.tsx
````typescript
import type {Meta, StoryObj} from '@storybook/react'
import HudCard2 from './HudCard2'
⋮----
type Story = StoryObj<typeof HudCard2>
````

## File: src/components/hud-interface/HudCard2.tsx
````typescript
import type React from 'react'
interface HudCard2Props {
  className?: string
}
const HudCard2: React.FC<HudCard2Props> = (
````

## File: src/components/hud-interface/HudDash.stories.tsx
````typescript
import type {Meta, StoryObj} from '@storybook/react'
import HudDash from './HudDash'
⋮----
type Story = StoryObj<typeof HudDash>
````

## File: src/components/hud-interface/HudDash.tsx
````typescript
import {useEffect, useRef} from 'react'
import {initAnimations} from './HudDash.animations'
interface HudDashProps {
  className?: string
}
````

## File: src/components/hud-interface/HudInterface.tsx
````typescript
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
export type HudInterfaceProps = {
  className?: string
}
⋮----
// Make sure GSAP is loaded
⋮----
const initializeHUD = () =>
const animateTerminalText = () =>
const animateWireframe = () =>
const handleClick = () =>
````

## File: src/components/hud-interface/index.tsx
````typescript

````

## File: src/components/hud-interface/SpaceCard.stories.tsx
````typescript
import type React from 'react'
import type {Meta, StoryObj} from '@storybook/react'
import SpaceCard from './SpaceCard'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/hud-interface/SpaceCard.tsx
````typescript
import type React from 'react'
import {useState, useEffect, useRef} from 'react'
interface CardData {
  id: string
  label: string
  image: string
  music: string
  trackName: string
}
interface SpaceCardProps {
  className?: string
  cards?: CardData[]
  initialActiveIndex?: number
}
⋮----
// State for the component
⋮----
const formatTime = (seconds: number) =>
const updatePlayerProgress = () =>
const setMusicTrack = (index: number) =>
const navigatePrev = () =>
const navigateNext = () =>
const togglePlay = () =>
const toggleMute = () =>
const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) =>
const handleKeyDown = (e: React.KeyboardEvent) =>
⋮----
const handleLoadedMetadata = () =>
````

## File: src/components/hud-interface/TextScrambleEffect.tsx
````typescript
import {useState, useEffect, useRef} from 'react'
interface TextScrambleEffectProps {
  phrases?: string[]
  interval?: number
  className?: string
}
const TextScrambleEffect = ({
  phrases = [
    'Neo,',
    'sooner or later',
    "you're going to realize",
    'just as I did',
    "that there's a difference",
    'between knowing the path',
    'and walking the path',
  ],
  interval = 800,
  className = '',
}: TextScrambleEffectProps) =>
⋮----
const randomChar = () =>
const update = () =>
const setText = (newText: string) =>
const nextPhrase = () =>
````

## File: src/components/loaders/index.tsx
````typescript

````

## File: src/components/loaders/loading.tsx
````typescript
import { Static } from '@/components/animated/static'
export const Loading = (
````

## File: src/components/loaders/sightings-loader.tsx
````typescript
import { cn } from "@/utils";
import { motion } from "framer-motion";
interface SightingsLoaderProps {
	className?: string;
	size?: "sm" | "md" | "lg";
}
````

## File: src/components/location-visualization/index.tsx
````typescript

````

## File: src/components/location-visualization/LocationVisualization.tsx
````typescript
import { AdminDashboardGlobe } from '@/components/globes/cobe-globes/admin-dashboard-globe'
import { useMindMap } from '@/contexts'
import { useEffect, useState } from 'react'
export interface LocationVisualizationProps { }
export const LocationVisualization: React.FC<LocationVisualizationProps> = (
  props: LocationVisualizationProps
) =>
````

## File: src/components/loggers/render-logger.tsx
````typescript
import React, { useEffect, useRef } from 'react'
export type RenderLoggerProps = {
  id: any
  [key: string]: any
}
export const RenderLogger = (props: RenderLoggerProps) =>
````

## File: src/components/moon/index.tsx
````typescript

````

## File: src/components/multistep-loader/index.tsx
````typescript

````

## File: src/components/multistep-loader/multistep-loader.stories.ts
````typescript
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { MultiStepLoader } from '@/components/multistep-loader/multistep-loader'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/multistep-loader/multistep-loader.tsx
````typescript
import { cn } from '@/utils/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
````

## File: src/components/navbar/index.tsx
````typescript

````

## File: src/components/navbar/navbar.tsx
````typescript
import React, {useState} from 'react'
import {motion, AnimatePresence, useScroll, useMotionValueEvent} from 'framer-motion'
import {cn} from '@/utils/cn'
import Link from 'next/link'
import {Sparkles, LibraryBig, Crosshair, Home as HomeIcon} from 'lucide-react'
⋮----
className=
````

## File: src/components/navbar/ut-logo-alt.tsx
````typescript
import React, { useState, useEffect, useCallback } from 'react'
⋮----
type SVGLineGlowAnimateProps = {
  movementDelay?: number
  id: number
  additionalHeight?: number
  initialGradientY?: number
}
type GradientPosition = {
  y1: number
  y2: number
}
const SVGLineGlowAnimate: React.FC<SVGLineGlowAnimateProps> = ({
  id,
  movementDelay = 0,
  additionalHeight = 0,
  initialGradientY = 0,
}) =>
⋮----
xmlns='http://www.w3.org/2000/svg'
⋮----
export const UltraLogoAlt = () =>
````

## File: src/components/navbar/ut-logo.tsx
````typescript
import { Link } from 'next-view-transitions'
export const UltraterrestrialLogo = () =>
````

## File: src/components/note/AddNote.tsx
````typescript
import { AddNoteFloatingPanel } from './AddNoteFloatingPanel'
import { AddNotePopover } from './AddNotePopover'
export const AddNote = (
````

## File: src/components/note/AddNoteFloatingPanel.tsx
````typescript
import { FloatingPanelCloseButton, FloatingPanelContent, FloatingPanelFooter, FloatingPanelForm, FloatingPanelRoot, FloatingPanelSubmitButton, FloatingPanelTextarea, FloatingPanelTrigger } from "@/components/animated"
import { Lightbulb } from "lucide-react"
export function AddNoteFloatingPanel(
````

## File: src/components/note/AddNotePopover.tsx
````typescript
import { PopoverCloseButton, PopoverContent, PopoverFooter, PopoverForm, PopoverRoot, PopoverSubmitButton, PopoverTextarea, PopoverTrigger } from '@/components/animated'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'
import { useState } from 'react'
⋮----
export const AddNotePopover = (
⋮----
const handleSavingNote = () =>
const handleSubmit = () =>
````

## File: src/components/note/index.tsx
````typescript

````

## File: src/components/reactbits/AnimatedContent/AnimatedContent.tsx
````typescript
import { useRef, useEffect, useState, ReactNode } from "react";
import { useSpring, animated, SpringConfig } from "@react-spring/web";
interface AnimatedContentProps {
	children: ReactNode;
	distance?: number;
	direction?: "vertical" | "horizontal";
	reverse?: boolean;
	config?: SpringConfig;
	initialOpacity?: number;
	animateOpacity?: boolean;
	scale?: number;
	threshold?: number;
	delay?: number;
}
const AnimatedContent: React.FC<AnimatedContentProps> = ({
	children,
	distance = 100,
	direction = "vertical",
	reverse = false,
	config = { tension: 50, friction: 25 },
	initialOpacity = 0,
	animateOpacity = true,
	scale = 1,
	threshold = 0.1,
	delay = 0,
}) =>
````

## File: src/components/reactbits/Carousel/Carousel.tsx
````typescript
import { useEffect, useState, useRef } from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import {
	FiCircle,
	FiCode,
	FiFileText,
	FiLayers,
	FiLayout,
} from "react-icons/fi";
export interface CarouselItem {
	title: string;
	description: string;
	id: number;
	icon: JSX.Element;
}
export interface CarouselProps {
	items?: CarouselItem[];
	baseWidth?: number;
	autoplay?: boolean;
	autoplayDelay?: number;
	pauseOnHover?: boolean;
	loop?: boolean;
	round?: boolean;
}
⋮----
const handleMouseEnter = ()
const handleMouseLeave = ()
⋮----
const handleAnimationComplete = () =>
const handleDragEnd = (
		_: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo,
): void =>
````

## File: src/components/reactbits/InfiniteMenu/InfiniteMenu.tsx
````typescript
import { FC, useRef, useState, useEffect, MutableRefObject } from "react";
import { mat4, quat, vec2, vec3 } from "gl-matrix";
⋮----
class Face
⋮----
constructor(a: number, b: number, c: number)
⋮----
class Vertex
⋮----
constructor(x: number, y: number, z: number)
⋮----
class Geometry
⋮----
constructor()
public addVertex(...args: number[]): this
public addFace(...args: number[]): this
public get lastVertex(): Vertex
public subdivide(divisions = 1): this
public spherize(radius = 1): this
public get data():
public get vertexData(): Float32Array
public get normalData(): Float32Array
public get uvData(): Float32Array
public get indexData(): Uint16Array
public getMidPoint(
		ndxA: number,
		ndxB: number,
		cache: Record<string, number>,
): number
⋮----
class IcosahedronGeometry extends Geometry
class DiscGeometry extends Geometry
⋮----
constructor(steps = 4, radius = 1)
⋮----
function createShader(
	gl: WebGL2RenderingContext,
	type: number,
	source: string,
): WebGLShader | null
function createProgram(
	gl: WebGL2RenderingContext,
	shaderSources: [string, string],
	transformFeedbackVaryings?: string[] | null,
	attribLocations?: Record<string, number>,
): WebGLProgram | null
function makeVertexArray(
	gl: WebGL2RenderingContext,
	bufLocNumElmPairs: Array<[WebGLBuffer, number, number]>,
	indices?: Uint16Array,
): WebGLVertexArrayObject | null
function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean
function makeBuffer(
	gl: WebGL2RenderingContext,
	sizeOrData: number | ArrayBufferView,
	usage: number,
): WebGLBuffer
function createAndSetupTexture(
	gl: WebGL2RenderingContext,
	minFilter: number,
	magFilter: number,
	wrapS: number,
	wrapT: number,
): WebGLTexture
type UpdateCallback = (deltaTime: number) => void;
class ArcballControl
⋮----
constructor(canvas: HTMLCanvasElement, updateCallback?: UpdateCallback)
public update(deltaTime: number, targetFrameDuration = 16): void
private quatFromVectors(
		a: vec3,
		b: vec3,
		out: quat,
		angleFactor = 1,
):
private project(pos: vec2): vec3
⋮----
interface MenuItem {
	image: string;
	link: string;
	title: string;
	description: string;
}
type ActiveItemCallback = (index: number) => void;
type MovementChangeCallback = (isMoving: boolean) => void;
type InitCallback = (instance: InfiniteGridMenu) => void;
interface Camera {
	matrix: mat4;
	near: number;
	far: number;
	fov: number;
	aspect: number;
	position: vec3;
	up: vec3;
	matrices: {
		view: mat4;
		projection: mat4;
		inversProjection: mat4;
	};
}
class InfiniteGridMenu
⋮----
constructor(
		private canvas: HTMLCanvasElement,
		private items: MenuItem[],
		private onActiveItemChange: ActiveItemCallback,
		private onMovementChange: MovementChangeCallback,
		onInit?: InitCallback,
)
public resize(): void
public run(time = 0): void
private init(onInit?: InitCallback): void
private initTexture(): void
private initDiscInstances(count: number): void
private animate(deltaTime: number): void
private render(): void
private updateCameraMatrix(): void
private updateProjectionMatrix(): void
private onControlUpdate(deltaTime: number): void
private findNearestVertexIndex(): number
private getVertexWorldPosition(index: number): vec3
⋮----
// -------- React Component --------
interface InfiniteMenuProps {
	items?: MenuItem[];
}
⋮----
const handleActiveItem = (index: number) =>
⋮----
const handleResize = () =>
⋮----
const handleButtonClick = () =>
````

## File: src/components/reactbits/true-focus-cursor/index.tsx
````typescript
import type React from 'react'
import {useState, useEffect, useRef} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
interface TextCursorProps {
  text: string
  delay?: number
  spacing?: number
  followMouseDirection?: boolean
  randomFloat?: boolean
  exitDuration?: number
  removalInterval?: number
  maxPoints?: number
}
interface TrailItem {
  id: number
  x: number
  y: number
  angle: number
  randomX?: number
  randomY?: number
  randomRotate?: number
}
⋮----
const handleMouseMove = (e: MouseEvent) =>
````

## File: src/components/sci-fi/footer/footer.tsx
````typescript
export const Footer = () =>
⋮----
<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
⋮----
<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
````

## File: src/components/sci-fi/arrow-ui.tsx
````typescript
export const ArrowUI = () =>
export const ElegantHeaderDesign = () =>
⋮----
xmlns="http://www.w3.org/2000/svg"
⋮----
export const SideArrayTwo = () =>
⋮----
xmlns="http://www.w3.org/2000/svg"
````

## File: src/components/sci-fi/brain-comparison.tsx
````typescript
import { useEffect, useRef } from "react"
⋮----
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
⋮----
const createBrain = (position: THREE.Vector3, scale = 1) =>
⋮----
const animate = () =>
````

## File: src/components/sci-fi/brain-scanner.tsx
````typescript
import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Scan, Target } from "lucide-react"
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}
⋮----
const initParticles = () =>
const drawBrain = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) =>
const animate = () =>
````

## File: src/components/sci-fi/brain-visualization.tsx
````typescript
import { useEffect, useRef } from "react"
⋮----
const animate = () =>
````

## File: src/components/sci-fi/file-stack-demo.tsx
````typescript
import { HolographicFileStack } from "./holographic-file-stack";
````

## File: src/components/sci-fi/holographic-file-stack.tsx
````typescript
import { OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useRef, useState } from "react";
⋮----
interface FileStackProps {
	files?: {
		title: string;
		color: string;
		id: string;
	}[];
	spacing?: number;
	rotationFactor?: number;
	className?: string;
}
⋮----
const handleClick = () =>
const handleKeyDown = (e: React.KeyboardEvent) =>
````

## File: src/components/sci-fi/index.ts
````typescript

````

## File: src/components/sci-fi/minimal-vertical-menu.tsx
````typescript
import { cn } from "@/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
export const ThemeSwitcher = () =>
````

## File: src/components/sci-fi/skull-scan.tsx
````typescript
import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { BrainVisualization } from "./components/brain-visualization"
import { BrainComparison } from "./components/brain-comparison"
import { ChevronRightIcon, DotFilledIcon } from "@radix-ui/react-icons"
⋮----
const drawInterface = (ctx: CanvasRenderingContext2D, width: number, height: number) =>
const animate = () =>
````

## File: src/components/sci-fi-hud/canvas-background.tsx
````typescript
import { useEffect, useRef } from "react"
⋮----
const drawInterface = (ctx: CanvasRenderingContext2D, width: number, height: number) =>
const animate = () =>
````

## File: src/components/sci-fi-hud/comparison.tsx
````typescript
import { useEffect, useRef } from "react"
⋮----
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
⋮----
const createBrain = (position: THREE.Vector3, scale = 1) =>
⋮----
const animate = () =>
⋮----
const handleResize = () =>
````

## File: src/components/sci-fi-hud/right-ui.tsx
````typescript
import { Activity } from "lucide-react"
import { ChevronRightIcon } from "@radix-ui/react-icons"
interface RightUIProps {
  selectedTab: number
  setSelectedTab: (index: number) => void
}
````

## File: src/components/sci-fi-hud/scan.tsx
````typescript
import { useState } from "react"
import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { CanvasBackground } from "./components/canvas-background"
import { SideUI } from "./components/side-ui"
import { RightUI } from "./components/right-ui"
import { ViewLabels } from "./components/view-labels"
⋮----
export default function Scanner()
````

## File: src/components/sci-fi-hud/scanner.tsx
````typescript
import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Scan, Target } from "lucide-react"
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}
⋮----
const initParticles = () =>
const drawBrain = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) =>
const animate = () =>
````

## File: src/components/sci-fi-hud/side-ui.tsx
````typescript
import { DotFilledIcon } from "@radix-ui/react-icons";
````

## File: src/components/sci-fi-hud/view-labels.tsx
````typescript
interface ViewLabelsProps {
  selectedTab: number
}
export function ViewLabels(
````

## File: src/components/sci-fi-hud/visualization.tsx
````typescript
import { useEffect, useRef } from "react"
⋮----
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
⋮----
const animate = () =>
⋮----
const handleResize = () =>
````

## File: src/components/search/animated-search-input.tsx
````typescript
import React, { useRef, useState }
  from 'react'
import useMeasure from 'react-use-measure'
import { motion, MotionConfig } from 'framer-motion'
import { useClickOutside } from '@/hooks/useClickOutside'
import { ArrowLeft, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
````

## File: src/components/search/index.tsx
````typescript

````

## File: src/components/search/search-input.tsx
````typescript
import React, { useRef, useState } from 'react'
import useMeasure from 'react-use-measure'
import { motion, MotionConfig } from 'framer-motion'
import { useClickOutside } from '@/hooks/useClickOutside'
import { ArrowLeft, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
````

## File: src/components/shader/index.tsx
````typescript

````

## File: src/components/shader/shader.tsx
````typescript
import React from 'react'
import { MeshDistortMaterial, SpotLight, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
⋮----
import { useRef } from 'react'
export interface ShaderProps {
  position: any
  img: any
  reference: any
}
````

## File: src/components/side-panel/side-panel.tsx
````typescript
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import React, { type ReactNode, forwardRef } from "react";
import useMeasure from "react-use-measure";
import { cn } from "@/utils";
type PanelContainerProps = {
	panelOpen: boolean;
	handlePanelOpen: () => void;
	className?: string;
	videoUrl?: string;
	renderButton?: (handleToggle: () => void) => ReactNode;
	children: ReactNode;
};
````

## File: src/components/tabs/index.tsx
````typescript

````

## File: src/components/tabs/tabs.stories.ts
````typescript
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Tabs } from './tabs'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/tabs/tabs.tsx
````typescript
import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
type Tab = {
  title: string
  value: string
  content?: string | React.ReactNode | any
}
⋮----
const moveSelectedTabToTop = ( idx: number ) =>
⋮----
className=
⋮----
const isActive = ( tab: Tab ) =>
````

## File: src/components/timelines/3d-timeline/index.tsx
````typescript

````

## File: src/components/timelines/3d-timeline/ThreeDTimeline.stories.tsx
````typescript
import type { Meta, StoryObj } from '@storybook/react'
import { ThreeDTimeline } from './ThreeDTimeline'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/timelines/3d-timeline/ThreeDTimeline.tsx
````typescript
import { cn } from "@/utils"
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect, useRef } from 'react'
⋮----
interface Slide {
  id: string
  image: string
  title?: string
}
interface ThreeDTimelineProps {
  slides: Slide[]
  className?: string
  showNavigation?: boolean
}
⋮----
function getInitialTranslateZ( slide: HTMLElement )
function mapRange( value: number, inMin: number, inMax: number, outMin: number, outMax: number )
````

## File: src/components/timelines/3d-timeline/ThreeDTimelineExample.tsx
````typescript
import React from 'react';
import { ThreeDTimeline } from './ThreeDTimeline';
⋮----
export const ThreeDTimelineExample: React.FC = () =>
````

## File: src/components/timelines/draggable-timeline/data/items.ts
````typescript

````

## File: src/components/timelines/draggable-timeline/draggable-timeline.stories.tsx
````typescript
import type { Meta, StoryObj } from '@storybook/react'
import { DraggableTimeline } from './draggable-timeline'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/timelines/draggable-timeline/draggable-timeline.tsx
````typescript
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
interface TimelineProps {
  items: any[]
}
export function DraggableTimeline(
````

## File: src/components/timelines/draggable-timeline/index.tsx
````typescript

````

## File: src/components/timelines/draggable-timeline/Section.tsx
````typescript
import { motion } from 'framer-motion'
interface SectionProps {
  item: any
  index: number
}
````

## File: src/components/timelines/scroll-through-timeline/scroll-through-timeline.tsx
````typescript
import type { EventsRecord } from "@/db/xata"
import { Float } from "@react-three/drei"
import { format } from "date-fns"
import { motion, useAnimate } from "framer-motion"
````

## File: src/components/timelines/timeline/index.tsx
````typescript

````

## File: src/components/timelines/timeline/Timeline.stories.tsx
````typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Timeline } from './Timeline'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/timelines/timeline/Timeline.tsx
````typescript
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect, useRef } from 'react'
⋮----
interface TimelineEvent {
  year: string
  title: string
  imageUrl: string
}
interface TimelineProps {
  events: TimelineEvent[]
  className?: string
}
⋮----
const lastItemWidth = ()
const getUseableHeight = ()
const getDraggableWidth = ()
⋮----
const updatePosition = () =>
⋮----
const initSectionAnimation = () =>
⋮----
const handleKeyUp = ( e: KeyboardEvent ) =>
````

## File: src/components/timelines/timeline/TimelineExample.tsx
````typescript
import React from 'react'
import { Timeline } from './Timeline'
⋮----
export const TimelineExample: React.FC = () =>
````

## File: src/components/timelines/index.tsx
````typescript

````

## File: src/components/toolbars/dynamic-toolbar/DynamicToolbar.stories.tsx
````typescript
import type { Meta, StoryObj } from '@storybook/react'
import { DynamicToolbar } from './DynamicToolbar'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/toolbars/dynamic-toolbar/index.tsx
````typescript

````

## File: src/components/toolbars/mini-toolbar/index.tsx
````typescript

````

## File: src/components/toolbars/mini-toolbar/MiniToolbar.stories.tsx
````typescript
import type { Meta, StoryObj } from '@storybook/react';
import { MiniToolbar } from './MiniToolbar';
⋮----
type Story = StoryObj<typeof meta>;
````

## File: src/components/toolbars/index.tsx
````typescript

````

## File: src/components/toolbars/ui-lab-toolbar.stories.tsx
````typescript
import type {Meta, StoryObj} from '@storybook/react'
import {UiLabToolbar} from './ui-lab-toolbar'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/toolbars/ui-lab-toolbar.tsx
````typescript
interface UiLabToolbarProps {}
export const UiLabToolbar = () =>
````

## File: src/components/ufo/UFO.tsx
````typescript
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
````

## File: src/components/ui/button/delete-button/DeleteButton.tsx
````typescript
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { cn } from '@/utils'
⋮----
const handleDeleteClick = () =>
const handleCancelClick = () =>
⋮----
className=
````

## File: src/components/ui/button/delete-button/index.tsx
````typescript

````

## File: src/components/ui/button/divider-buttons/divider-button.stories.tsx
````typescript
import type { Meta, StoryObj } from '@storybook/react'
import { DividerButton } from './divider-button'
⋮----
type Story = StoryObj<typeof DividerButton>
````

## File: src/components/ui/button/divider-buttons/divider-button.tsx
````typescript
import { motion } from 'framer-motion'
import { twMerge } from 'tailwind-merge'
interface DividerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}
````

## File: src/components/ui/button/divider-buttons/index.ts
````typescript

````

## File: src/components/ui/button/animated-button.tsx
````typescript
import { FC, ReactNode, useState } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, XIcon } from 'lucide-react'
import { cn } from '@/utils'
⋮----
interface AnimatedButtonProps {
  children: React.ReactNode
}
⋮----
const toggleExpand = ()
````

## File: src/components/ui/button/animated-menu-button.tsx
````typescript
import { motion } from "framer-motion"
import { useState } from "react"
⋮----
const handleClick = () =>
````

## File: src/components/ui/button/create-button.tsx
````typescript
import { AnimatePresence, motion } from "framer-motion"
import {
  BellRing,
  ClipboardList,
  Flag,
  Folder,
  Plus,
  StickyNote,
  Trophy,
  X,
} from "lucide-react"
import { useState } from "react"
````

## File: src/components/ui/button/share-button.tsx
````typescript
import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'
⋮----
const handleClick = () =>
````

## File: src/components/ui/button/shiny-button.tsx
````typescript
import { type AnimationProps, motion } from "framer-motion";
````

## File: src/components/ui/canvas-cursor/blob-cursor.tsx
````typescript
import AnimatedCursor from "react-animated-cursor";
type BlobCursorProps = React.HTMLAttributes<HTMLDivElement>;
export const BlobCursor: React.FC<BlobCursorProps> = () =>
⋮----
xmlns="http://www.w3.org/2000/svg"
````

## File: src/components/ui/canvas-cursor/canvas-cursor.tsx
````typescript
import useCanvasCursor from "@/hooks/useCanvasCursor";
export const CanvasCursor = () =>
⋮----
xmlns="http://www.w3.org/2000/svg"
````

## File: src/components/ui/canvas-cursor/index.tsx
````typescript

````

## File: src/components/ui/card/bento/bento-cards.tsx
````typescript
import { cn } from '@/utils'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { BentoGrid, BentoGridItem } from '@/components/ui/card/bento/bento-grid'
⋮----
className=
````

## File: src/components/ui/card/bento/bento-grid.tsx
````typescript
import { cn } from '@/utils'
export const BentoGrid = ( {
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
} ) =>
⋮----
className=
````

## File: src/components/ui/card/bento/index.tsx
````typescript

````

## File: src/components/ui/card/card-stack/card-stack.tsx
````typescript
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
⋮----
interface CardRotateProps {
	children: React.ReactNode;
	onSendToBack: () => void;
	sensitivity: number;
}
⋮----
function handleDragEnd(_: never, info:
⋮----
const sendToBack = (id: number) =>
````

## File: src/components/ui/card/card-stack/index.tsx
````typescript

````

## File: src/components/ui/card/data-card/data-card.tsx
````typescript
import { format } from 'date-fns'
⋮----
interface DataCardProps {
  name: string
  description: string
  location: string
  city: string
  state: string
  date: string
  coordinates: string
  summary: string
  image: string
  video: string
  country: string
  comments?: string
  shape: string
  duration_hours_min: string
  latitude: number
  longitude: number
}
export const DataCard: React.FC<DataCardProps> = (props) =>
````

## File: src/components/ui/card/expandable-card/ExpandableCardGridLayout.tsx
````typescript
import Image from 'next/image'
import React, { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOutsideClick } from '@/hooks/useOutsideClick'
⋮----
function onKeyDown( event: KeyboardEvent )
⋮----
return (
````

## File: src/components/ui/card/expandable-card/ExpandableCardStandardLayout.tsx
````typescript
import Image from 'next/image'
import React, { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOutsideClick } from '@/hooks/useOutsideClick'
⋮----
function onKeyDown( event: KeyboardEvent )
⋮----
return (
````

## File: src/components/ui/card/expandable-card/index.tsx
````typescript

````

## File: src/components/ui/card/hover-card/hover-card.stories.ts
````typescript
import type { Meta, StoryObj } from '@storybook/react'
import { HoverCard } from './hover-card'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/ui/card/hover-card/index.tsx
````typescript

````

## File: src/components/ui/card/list-card/index.tsx
````typescript

````

## File: src/components/ui/card/pill-card/index.tsx
````typescript

````

## File: src/components/ui/card/pill-card/PillCard.tsx
````typescript
import { ConnectionsIcon } from '@/components/icons'
import { ShinyButton } from '@/components/ui/button'
import { useEntity } from '@/hooks'
import { cn } from '@/utils'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
⋮----
const handleToggle = () =>
⋮----
className=
````

## File: src/components/ui/card/background-overlay-card.tsx
````typescript
import type { MindMapEntityCardProps } from '@/features/mindmap/components/cards/entity-card/entity-card'
export function BackgroundOverlayCard(
````

## File: src/components/ui/card/card.tsx
````typescript
import { cn } from "@/utils";
⋮----
className=
⋮----
<div ref=
````

## File: src/components/ui/card/expandable-card.tsx
````typescript
import { cn } from "@/utils"
import React, { useState } from 'react'
interface ExpandableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  defaultExpanded?: boolean
  children: React.ReactNode
}
⋮----
className=
````

## File: src/components/ui/card/ExpandableCard.tsx
````typescript
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
⋮----
const handleToggle = () =>
const handleClose = (e) =>
````

## File: src/components/ui/card/graph-node-card.tsx
````typescript
import { DotGridBackgroundBlack } from '@/components/backgrounds'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useState, useEffect } from 'react'
⋮----
export type GraphNodeCardData = {
  data: {
    date: string
    description: string
    latitude: number
    longitude: number
    location: string
    photos: string[]
    name: string
    color: string
    type: string
    label: string
    fill: string
  }
}
export const GraphNodeCard: React.FC<GraphNodeCardData> = ( {
  data,
  ...rest
} ) =>
````

## File: src/components/ui/card/grid-layout-examples.tsx
````typescript
import { cn } from "@/utils"
import { motion } from 'framer-motion'
import { GridLayout } from './grid-layout'
⋮----
className=
````

## File: src/components/ui/card/grid-layout.tsx
````typescript
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
interface GridLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gap?: number;
  minChildWidth?: number;
  className?: string;
  animate?: boolean;
}
⋮----
className=
````

## File: src/components/ui/card/hover-card.tsx
````typescript
import { cn } from "@/utils"
````

## File: src/components/ui/card/index.tsx
````typescript

````

## File: src/components/ui/card/pill-card.tsx
````typescript
import { cn } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
interface PillItem {
	name: string;
	description: string;
	color: string;
	bg: string;
	text: string;
}
interface PillCardProps {
	items: PillItem[];
	className?: string;
}
⋮----
const handleMouseEnter = (index: number) =>
const handleMouseLeave = () =>
````

## File: src/components/ui/card/shift-card-demo.tsx
````typescript
import { Button } from '@/components/ui/button'
import { ShiftCard } from '@/components/ui/card/shift-card'
import { motion } from 'framer-motion'
⋮----
xmlns='http://www.w3.org/2000/svg'
⋮----
xmlns='http://www.w3.org/2000/svg'
````

## File: src/components/ui/card/shift-card.tsx
````typescript
import { AnimatePresence, MotionProps, motion } from 'framer-motion'
import { cn } from '@/utils'
interface ShiftCardProps
  extends Omit<MotionProps, 'onAnimationStart' | 'onAnimationComplete'> {
  className?: string
  topContent?: React.ReactNode
  middleContent?: React.ReactNode
  topAnimateContent?: React.ReactNode
  bottomContent?: React.ReactNode
}
⋮----
interface ShiftCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  isHovered: boolean
}
⋮----
const handleMouseEnter = ()
const handleMouseLeave = ()
const handleTapStart = ()
const handleTapCancel = ()
const handleTap = ()
⋮----
className=
````

## File: src/components/ui/card/simple-card.tsx
````typescript
import { cn } from '@/utils'
````

## File: src/components/ui/card/stars-card.tsx
````typescript
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Illustration } from '@/components/backgrounds/stars-background'
export type StarsCardProps = {
  className?: string
  children?: any
}
⋮----
export const StarsCardTitle = ( {
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
} ) =>
````

## File: src/components/ui/card/text-reveal-card.tsx
````typescript
import React, { useEffect, useRef, useState, memo } from 'react'
import { motion } from 'framer-motion'
import { twMerge } from 'tailwind-merge'
import { cn } from '@/utils'
⋮----
function mouseMoveHandler( event: any )
function mouseLeaveHandler()
function mouseEnterHandler()
function touchMoveHandler( event: React.TouchEvent<HTMLDivElement> )
⋮----
className=
⋮----
const randomMove = ()
const randomOpacity = ()
const random = ()
````

## File: src/components/ui/card/toggle-entity-input-with-search.tsx
````typescript
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
interface Entity {
  id: string;
  name: string;
  description?: string;
  icon?: React.ReactNode;
}
interface ToggleEntityInputWithSearchProps {
  entities: Entity[];
  selectedEntities: Entity[];
  onSelect: (entity: Entity) => void;
  onRemove: (entity: Entity) => void;
  placeholder?: string;
  className?: string;
  maxSelections?: number;
}
⋮----
const handleClickOutside = (event: MouseEvent) =>
⋮----
const handleInputFocus = () =>
const handleEntitySelect = (entity: Entity) =>
⋮----
className=
⋮----
onChange=
````

## File: src/components/ui/chat/chat-bubble.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import MessageLoading from "./message-loading"
import { Button, ButtonProps } from "../button"
⋮----
interface ChatBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof chatBubbleVariant> { }
⋮----
<div className=
````

## File: src/components/ui/chat/chat-input.tsx
````typescript
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/Textarea"
import { useTextareaResize } from "@/hooks/use-textarea-resize"
import { cn } from "@/utils"
import { ArrowUpIcon } from "lucide-react"
import type React from "react"
import { createContext, useContext } from "react"
interface ChatInputContextValue {
	value?: string
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
	onSubmit?: () => void
	loading?: boolean
	onStop?: () => void
	variant?: "default" | "unstyled"
	rows?: number
}
⋮----
interface ChatInputProps extends Omit<ChatInputContextValue, "variant"> {
	children: React.ReactNode
	className?: string
	variant?: "default" | "unstyled"
	rows?: number
}
function ChatInput( {
	children,
	className,
	variant = "default",
	value,
	onChange,
	onSubmit,
	loading,
	onStop,
	rows = 1,
}: ChatInputProps )
⋮----
className=
⋮----
interface ChatInputTextAreaProps extends React.ComponentProps<typeof Textarea> {
	value?: string
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
	onSubmit?: () => void
	variant?: "default" | "unstyled"
}
⋮----
// Convert parent variant to textarea variant unless explicitly overridden
⋮----
const handleKeyDown = ( e: React.KeyboardEvent<HTMLTextAreaElement> ) =>
⋮----
const context = useContext( ChatInputContext )
````

## File: src/components/ui/chat/chat-message-area.tsx
````typescript
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/chat/scroll-area"
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom"
import { cn } from "@/utils"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import type { ReactNode } from "react"
type ScrollButtonAlignment = "left" | "center" | "right"
interface ScrollButtonProps {
	onClick: () => void
	alignment?: ScrollButtonAlignment
	className?: string
}
export function ScrollButton( {
	onClick,
	alignment = "right",
	className,
}: ScrollButtonProps )
interface ChatMessageAreaProps {
	children: ReactNode
	className?: string
	scrollButtonAlignment?: ScrollButtonAlignment
}
````

## File: src/components/ui/chat/chat-message-list.tsx
````typescript
import { cn } from "@/utils"
interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> { }
````

## File: src/components/ui/chat/chat-message.tsx
````typescript
import { MarkdownContent } from "@/components/ui/chat/markdown-content"
import { cn } from "@/utils"
import { type VariantProps, cva } from "class-variance-authority"
import { SparklesIcon, UserIcon } from "lucide-react"
import React, { type ReactNode } from "react"
⋮----
interface MessageContextValue extends VariantProps<typeof chatMessageVariants> {
	id: string
}
⋮----
const useChatMessage = () =>
interface ChatMessageProps
	extends React.HTMLAttributes<HTMLDivElement>,
	VariantProps<typeof chatMessageVariants> {
	children?: React.ReactNode
	id: string
}
⋮----
className=
⋮----
interface ChatMessageAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	imageSrc?: string
	icon?: ReactNode
}
````

## File: src/components/ui/chat/expandable-chat.tsx
````typescript
import type React from 'react'
import {useRef, useState} from 'react'
import {MessageCircle} from 'lucide-react'
import {cn} from '@/utils'
import {Button} from '@/components/ui/button'
import {Cross2Icon} from '@radix-ui/react-icons'
export type ChatPosition = 'bottom-right' | 'bottom-left'
export type ChatSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
⋮----
interface ExpandableChatProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: ChatPosition
  size?: ChatSize
  icon?: React.ReactNode
}
⋮----
const toggleChat = ()
⋮----
<div className=
⋮----
}) => <div className=
````

## File: src/components/ui/chat/index.tsx
````typescript

````

## File: src/components/ui/chat/message-loading.tsx
````typescript
export default function MessageLoading()
⋮----
xmlns="http://www.w3.org/2000/svg"
````

## File: src/components/ui/chat/scroll-area.tsx
````typescript
import { cn } from "@/utils"
⋮----
className=
````

## File: src/components/ui/command/command-mind-map-menu.tsx
````typescript
import React from 'react'
import { Command } from 'cmdk'
⋮----
function bounce()
````

## File: src/components/ui/command/command-search-menu.tsx
````typescript
import { Command } from 'cmdk'
interface CommandSearchMenuProps {}
export const CommandSearchMenu: React.FC<CommandSearchMenuProps> = () =>
````

## File: src/components/ui/direction-aware-tabs/direction-aware-tabs.tsx
````typescript
import { ReactNode, useMemo, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import useMeasure from 'react-use-measure'
import { cn } from '@/utils'
import { Button } from '@/components/ui/button'
type Tab = {
  id: number
  label: string
  content: ReactNode
}
interface OgImageSectionProps {
  tabs: Tab[]
  className?: string
  rounded?: string
  onChange?: () => void
}
⋮----
const handleTabClick = ( newTabId: number ) =>
````

## File: src/components/ui/direction-aware-tabs/index.tsx
````typescript

````

## File: src/components/ui/header/site-header.tsx
````typescript
import { Search } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { FunctionComponent } from 'react'
interface SiteHeaderProps { }
export const SiteHeader: FunctionComponent<SiteHeaderProps> = () =>
````

## File: src/components/ui/icons/arrow.tsx
````typescript
export const ArrowIcon = (
````

## File: src/components/ui/icons/index.tsx
````typescript

````

## File: src/components/ui/icons/openai.tsx
````typescript
export const OpenAILogo = (
````

## File: src/components/ui/kibo-ui/pill/index.tsx
````typescript
import { Avatar, AvatarFallback, AvatarImage } from "'@/components/ui/avatar'";
import { Badge, type BadgeProps } from "'@/components/ui/badge'";
import { Button } from "'@/components/ui/button'";
import { cn } from "'@/utils'";
import { ChevronDownIcon, ChevronUpIcon, MinusIcon } from "'lucide-react'";
import type { ComponentProps, ReactNode } from "'react'";
export type PillProps = BadgeProps & {
  themed?: boolean;
};
⋮----
className=
⋮----
return <ChevronDownIcon className=
⋮----
export type PillIconProps = {
  icon: typeof ChevronUpIcon;
  className?: string;
};
````

## File: src/components/ui/loading/globe-loading.tsx
````typescript
export function GlobeLoading()
````

## File: src/components/ui/tooltip/animated-tooltip.tsx
````typescript
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import Image from "next/image"
import { useState } from "react"
⋮----
const handleMouseMove = ( event: any ) =>
⋮----
onMouseLeave=
````

## File: src/components/ui/tooltip/index.tsx
````typescript

````

## File: src/components/ui/tooltip/tooltip.tsx
````typescript
import { cn } from "@/utils"
````

## File: src/components/ui/accordion.tsx
````typescript
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/utils"
function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>)
⋮----
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>)
⋮----
className=
⋮----
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>)
````

## File: src/components/ui/alert-dialog.tsx
````typescript
import { cn } from "@/utils"
import { buttonVariants } from "@/components/ui/button"
function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>)
function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>)
function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>)
````

## File: src/components/ui/alert.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils"
⋮----
className=
````

## File: src/components/ui/aspect-ratio.tsx
````typescript

````

## File: src/components/ui/avatar.tsx
````typescript
import { cn } from "@/utils"
⋮----
className=
````

## File: src/components/ui/breadcrumb.tsx
````typescript
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/utils"
import { ChevronRightIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
function Breadcrumb(
⋮----
className=
````

## File: src/components/ui/calendar.tsx
````typescript
import { DayPicker } from "react-day-picker"
import { cn } from "@/utils"
import { buttonVariants } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
````

## File: src/components/ui/card.tsx
````typescript
import { cn } from "@/utils"
⋮----
className=
````

## File: src/components/ui/carousel.tsx
````typescript
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { cn } from "@/utils"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons"
type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]
type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps
⋮----
function useCarousel()
````

## File: src/components/ui/chart.tsx
````typescript
import { cn } from "@/utils"
⋮----
export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}
type ChartContextProps = {
  config: ChartConfig
}
⋮----
function useChart()
function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
})
⋮----
className=
⋮----
<div className=
````

## File: src/components/ui/checkbox.tsx
````typescript
import { CheckIcon } from "lucide-react"
import { cn } from "@/utils"
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>)
⋮----
className=
````

## File: src/components/ui/collapsible.tsx
````typescript
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>)
function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>)
function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>)
````

## File: src/components/ui/command.tsx
````typescript
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon } from "lucide-react"
import { cn } from "@/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
⋮----
function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
})
⋮----
function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>)
````

## File: src/components/ui/context-menu.tsx
````typescript
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import { cn } from "@/utils"
function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>)
function ContextMenuTrigger({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>)
function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>)
function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>)
function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>)
function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>)
function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean
})
⋮----
className=
⋮----
function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>)
function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>)
````

## File: src/components/ui/dialog.tsx
````typescript
import { XIcon } from "lucide-react"
import { cn } from "@/utils"
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>)
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>)
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>)
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>)
⋮----
function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>)
⋮----
className=
````

## File: src/components/ui/drawer.tsx
````typescript
import { Drawer as DrawerPrimitive } from "vaul"
import { cn } from "@/utils"
function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>)
function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>)
function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>)
function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>)
⋮----
function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>)
⋮----
className=
````

## File: src/components/ui/dropdown-menu.tsx
````typescript
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import { cn } from "@/utils"
function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>)
function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>)
function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>)
⋮----
function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>)
⋮----
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>)
⋮----
className=
⋮----
function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>)
function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>)
⋮----
function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>)
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
})
````

## File: src/components/ui/expandable-card.tsx
````typescript
import React, { useRef, useEffect,useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  GitBranch,
  Github,
  MessageSquare,
  StepForwardIcon as Progress,
  Star,
  Users,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress as ProgressBar } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useExpandable } from "@/hooks/use-expandable";
interface ProjectStatusCardProps {
  title: string;
  progress: number;
  dueDate: string;
  contributors: Array<{ name: string; image?: string }>;
  tasks: Array<{ title: string; completed: boolean }>;
  githubStars: number;
  openIssues: number;
}
⋮----
const updateWidth = () =>
````

## File: src/components/ui/form.tsx
````typescript
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import { cn } from "@/utils"
import { Label } from "@/components/ui/label"
⋮----
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}
⋮----
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) =>
const useFormField = () =>
type FormItemContextValue = {
  id: string
}
⋮----
function FormItem(
⋮----
className=
⋮----
function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>)
function FormControl(
⋮----
function FormMessage(
````

## File: src/components/ui/gradient-tracing.tsx
````typescript
import React from "react"
import { motion } from "motion/react"
import Image from "next/image"
interface GradientTracingProps {
  width: number
  height: number
  baseColor?: string
  gradientColors?: [string, string, string]
  animationDuration?: number
  strokeWidth?: number
  path?: string
}
````

## File: src/components/ui/hover-card.tsx
````typescript
import { cn } from "@/utils"
function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>)
function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>)
⋮----
className=
````

## File: src/components/ui/index.ui.tsx
````typescript

````

## File: src/components/ui/input-otp.tsx
````typescript
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"
import { cn } from "@/utils"
function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
})
⋮----
containerClassName=
⋮----
function InputOTPSeparator(
````

## File: src/components/ui/input.tsx
````typescript
import { cn } from "@/utils"
function Input(
⋮----
className=
````

## File: src/components/ui/jsx-preview.tsx
````typescript
import JsxParser from "react-jsx-parser"
import type { TProps as JsxParserProps } from "react-jsx-parser"
function matchJsxTag(code: string)
function completeJsxTag(code: string)
export type JSXPreviewProps = {
  jsx: string
  isStreaming?: boolean
} & JsxParserProps
function JSXPreview(
````

## File: src/components/ui/label.tsx
````typescript
import { cn } from "@/utils"
⋮----
className=
````

## File: src/components/ui/markdown.tsx
````typescript
import { cn } from "@/utils"
import { marked } from "marked"
import { memo, useId, useMemo } from "react"
import ReactMarkdown, { Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { CodeBlock, CodeBlockCode } from "./code-block"
export type MarkdownProps = {
  children: string
  id?: string
  className?: string
  components?: Partial<Components>
}
function parseMarkdownIntoBlocks(markdown: string): string[]
function extractLanguage(className?: string): string
⋮----
className=
````

## File: src/components/ui/menubar.tsx
````typescript
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import { cn } from "@/utils"
⋮----
function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>)
function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>)
function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>)
function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>)
⋮----
function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>)
⋮----
className=
⋮----
function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>)
⋮----
function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>)
function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean
})
````

## File: src/components/ui/navigation-menu.tsx
````typescript
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/utils"
⋮----
function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>)
⋮----
className=
````

## File: src/components/ui/pagination.tsx
````typescript
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import { cn } from "@/utils"
import { Button, buttonVariants } from "@/components/ui/button"
⋮----
function PaginationItem(
type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">
⋮----
function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>)
⋮----
className=
⋮----
function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>)
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">)
````

## File: src/components/ui/popover.tsx
````typescript
import { cn } from "@/utils"
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>)
function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>)
⋮----
function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>)
````

## File: src/components/ui/progress.tsx
````typescript
import { cn } from "@/utils"
⋮----
className=
````

## File: src/components/ui/radio-group.tsx
````typescript
import { CircleIcon } from "lucide-react"
import { cn } from "@/utils"
⋮----
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>)
⋮----
className=
````

## File: src/components/ui/resizable.tsx
````typescript
import { GripVerticalIcon } from "lucide-react"
⋮----
import { cn } from "@/utils"
⋮----
function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>)
````

## File: src/components/ui/select.tsx
````typescript
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { cn } from "@/utils"
function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>)
function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>)
function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>)
function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>)
⋮----
className=
⋮----
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>)
⋮----
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>)
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>)
````

## File: src/components/ui/separator.tsx
````typescript
import { cn } from "@/utils"
⋮----
className=
````

## File: src/components/ui/services-grid.tsx
````typescript

````

## File: src/components/ui/sheet.tsx
````typescript
import { XIcon } from "lucide-react"
import { cn } from "@/utils"
function Sheet(
function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>)
function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>)
function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>)
⋮----
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
})
⋮----
className=
````

## File: src/components/ui/skeleton.tsx
````typescript
import { cn } from "@/utils"
⋮----
className=
````

## File: src/components/ui/slider.tsx
````typescript
import { cn } from "@/utils"
⋮----
className=
````

## File: src/components/ui/sonner.tsx
````typescript
import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"
const Toaster = (
````

## File: src/components/ui/switch.tsx
````typescript
import { cn } from "@/utils"
⋮----
className=
````

## File: src/components/ui/table.tsx
````typescript
import { cn } from "@/utils"
function Table(
⋮----
className=
````

## File: src/components/ui/tabs.tsx
````typescript
import { cn } from "@/utils"
⋮----
className=
````

## File: src/components/ui/textarea.tsx
````typescript
import { cn } from "@/utils"
⋮----
className=
````

## File: src/components/ui/toggle-group.tsx
````typescript
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/utils"
import { toggleVariants } from "@/components/ui/toggle"
⋮----
function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
VariantProps<typeof toggleVariants>)
⋮----
className=
⋮----
function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
VariantProps<typeof toggleVariants>)
````

## File: src/components/ui/toggle.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils"
````

## File: src/components/vertical-progress-ui/index.tsx
````typescript

````

## File: src/components/vertical-progress-ui/VerticalProgressUi.tsx
````typescript
import {motion} from 'framer-motion'
import {useState} from 'react'
⋮----
const handleMouseEnter = (index: number) =>
const handleMouseLeave = () =>
const calculateScale = (index: number) =>
````

## File: src/components/video/index.tsx
````typescript

````

## File: src/components/video/video.tsx
````typescript
import ReactPlayer from 'react-player'
export interface VideoProps {
  video: {
    url: string
  }
}
````

## File: src/components/animated-svg-edge.tsx
````typescript
import React, { FC } from "react";
import type { Edge, EdgeProps, Position } from "@xyflow/react";
import {
  BaseEdge,
  getBezierPath,
  getStraightPath,
  getSmoothStepPath,
} from "@xyflow/react";
export type AnimatedSvgEdge = Edge<{
  duration: number;
  direction?: "forward" | "reverse" | "alternate" | "alternate-reverse";
  path?: "bezier" | "smoothstep" | "step" | "straight";
  repeat?: number | "indefinite";
  shape: keyof typeof shapes;
}>;
export function AnimatedSvgEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data = {
    duration: 2,
    direction: "forward",
    path: "bezier",
    repeat: "indefinite",
    shape: "circle",
  },
  ...delegated
}: EdgeProps<AnimatedSvgEdge>)
type AnimateMotionProps = {
  dur: string;
  keyTimes: string;
  keyPoints: string;
  repeatCount: number | "indefinite";
  path: string;
};
type AnimatedSvg = FC<{ animateMotionProps: AnimateMotionProps }>;
⋮----
switch (direction)
````

## File: src/components/annotation-node.tsx
````typescript
import React, { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils";
export type AnnotationNodeProps = HTMLAttributes<HTMLDivElement>;
⋮----
className=
⋮----
export type AnnotationNodeNumberProps = HTMLAttributes<HTMLDivElement>;
⋮----
<div ref=
⋮----
export type AnnotationNodeContentProps = HTMLAttributes<HTMLDivElement>;
⋮----
export type AnnotationNodeIconProps = HTMLAttributes<HTMLDivElement>;
````

## File: src/components/chat-sidebar.tsx
````typescript
import {
	Sidebar,
	SidebarHeader,
	SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
	ChatInput,
	ChatInputSubmit,
	ChatInputTextArea,
} from "@/components/ui/chat/chat-input"
import {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageContent,
} from "@/components/ui/chat/chat-message"
import { ChatMessageArea } from "@/components/ui/chat/chat-message-area"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { useChat } from "ai/react"
import { MessageCircle, SquarePen } from "lucide-react"
export function ChatSidebar(
⋮----
const handleSubmitMessage = () =>
````

## File: src/components/data-edge.tsx
````typescript
import {
  BaseEdge,
  Edge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  Node,
  Position,
  useStore,
} from "@xyflow/react";
import { useMemo } from "react";
export type DataEdge<T extends Node = Node> = Edge<{
  key?: keyof T["data"];
  path?: "bezier" | "smoothstep" | "step" | "straight";
}>;
````

## File: src/components/DeployButton.tsx
````typescript
export default function DeployButton()
````

## File: src/components/dotted-dialog.tsx
````typescript
import { Cross2Icon } from "@radix-ui/react-icons"
import { cn } from "@/utils"
⋮----
className=
````

## File: src/components/grid-background.tsx
````typescript
export function GridBackground()
````

## File: src/components/grid-overlay.tsx
````typescript
export function GridOverlay()
````

## File: src/components/hero.tsx
````typescript
import styles from ''
import { motion } from 'framer-motion'
import { FunctionComponent } from 'react'
import ParticleImage, { ParticleOptions } from 'react-particle-image'
⋮----
export function FadeUpStagger()
````

## File: src/components/MastraHomepageHero.tsx
````typescript
import {CloudIcon, LocalDevIcon} from '@/components/icons'
import {TerminalDisplay} from '@/components/terminal-display'
import React, {useState, useEffect, useRef} from 'react'
⋮----
const handleMouseMove = (e: MouseEvent) =>
⋮----
const getGradientPosition = (element: HTMLElement | null) =>
````

## File: src/components/terminal-display.tsx
````typescript
import { Card } from "@/components/ui/card"
````

## File: src/components/test.tsx
````typescript
import React from 'react';
````

## File: src/components/web-vitals.tsx
````typescript
import { useReportWebVitals } from 'next/web-vitals'
export function WebVitals()
````

## File: src/contexts/ai/ai-context.tsx
````typescript
import { createContext, useContext, useReducer, useEffect } from "react";
import { OpenAIStream, StreamingTextResponse } from "ai";
import type { Message } from "ai/react";
import { Anthropic } from "@anthropic-ai/sdk";
import { ReactFlowProvider } from "@xyflow/react";
import type { Edge, Node } from "@xyflow/react";
import { aiReducer } from "@/contexts/ai/ai-reducer";
export interface AIContextState {
	nodes: any[];
	edges: any[];
	messages: Message[];
	isProcessing: boolean;
	insights: Record<string, any>[];
}
export interface AIContextValue extends AIContextState {
	updateMindmap: (nodes: Node[], edges: Edge[]) => void;
	processNewRecords: (records: any[]) => Promise<void>;
	streamNodeUpdate: (node: Node) => void;
}
⋮----
export function AIContextProvider(
⋮----
const updateMindmap = (nodes: any[], edges: any[]) =>
const streamNodeUpdate = (node: any) =>
const processNewRecords = async (records: any[]) =>
````

## File: src/contexts/ai/ai-reducer.tsx
````typescript
import type { AIContextState } from "@/contexts/ai/ai-context"
import type { Edge } from "@xyflow/react"
type AIAction =
  | { type: 'UPDATE_MINDMAP'; payload: { nodes: Node[]; edges: Edge[] } }
  | { type: 'ADD_NODE'; payload: Node }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'UPDATE_INSIGHTS'; payload: { insights: any[]; nodes: Node[]; edges: Edge[] } }
export function aiReducer( state: AIContextState, action: AIAction ): AIContextState
````

## File: src/contexts/mindmap/index.tsx
````typescript

````

## File: src/contexts/floating-context.tsx
````typescript
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react"
import { useAnimationFrame } from "motion/react"
import { cn } from "@//utils"
import { useFloatingMousePosition, useMousePosition } from "@/hooks/useMousePosition"
interface FloatingContextType {
  registerElement: ( id: string, element: HTMLDivElement, depth: number ) => void
  unregisterElement: ( id: string ) => void
}
⋮----
interface FloatingProps {
  children: ReactNode
  className?: string
  sensitivity?: number
  easingFactor?: number
}
export const Floating = ( {
  children,
  className,
  sensitivity = 1,
  easingFactor = 0.05,
  ...props
}: FloatingProps ) =>
⋮----
className=
⋮----
interface FloatingElementProps {
  children: ReactNode
  className?: string
  depth?: number
}
export const FloatingElement = ( {
  children,
  className,
  depth = 1,
}: FloatingElementProps ) =>
````

## File: src/contexts/index.tsx
````typescript

````

## File: src/contexts/location-provider.tsx
````typescript
import { useGeolocation } from '@uidotdev/usehooks'
import { createContext } from 'react'
⋮----
interface LocationProviderProps {
  children: any
}
export const LocationProvider: React.FC<LocationProviderProps> = ( {
  children,
} ) =>
````

## File: src/contexts/theme-provider.tsx
````typescript
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'
export function ThemeProvider(
````

## File: src/db/xata/db/fetch-paginated-records.ts
````typescript
import { xata } from "@/db/xata/client";
export const fetchPaginatedRecords = async ({
	table,
	size = 3,
}:
````

## File: src/db/xata/index.ts
````typescript

````

## File: src/features/3d/3d-card/3d-card.tsx
````typescript
import { ArrowIcon } from '@/components/ui/icons/arrow'
import { cn } from '@/utils/cn'
import Image from 'next/image'
import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from 'react'
⋮----
const handleMouseMove = ( e: React.MouseEvent<HTMLDivElement> ) =>
const handleMouseEnter = ( e: React.MouseEvent<HTMLDivElement> ) =>
const handleMouseLeave = ( e: React.MouseEvent<HTMLDivElement> ) =>
⋮----
className=
⋮----
export const CardItem = ( {
  as: Tag = 'div',
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType
  children: React.ReactNode
  className?: string
  translateX?: number | string
  translateY?: number | string
  translateZ?: number | string
  rotateX?: number | string
  rotateY?: number | string
  rotateZ?: number | string
  [key: string]: any
} ) =>
⋮----
const handleAnimations = () =>
⋮----
export const useMouseEnter = () =>
````

## File: src/features/3d/3d-pin/3d-pin.tsx
````typescript
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import Link from 'next/link'
⋮----
const onMouseEnter = () =>
const onMouseLeave = () =>
⋮----
className=
````

## File: src/features/3d/3d-pin/index.tsx
````typescript

````

## File: src/features/3d/3d-timeline-journey/config/assetData.ts
````typescript

````

## File: src/features/3d/3d-timeline-journey/config/assetOrder.ts
````typescript

````

## File: src/features/3d/3d-timeline-journey/config/index.ts
````typescript

````

## File: src/features/3d/3d-timeline-journey/config/months.ts
````typescript

````

## File: src/features/3d/3d-timeline-journey/shaders/default.vert
````
varying vec2 vUv;

uniform float time;

void main () {

    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1 );

}
````

## File: src/features/3d/3d-timeline-journey/shaders/greenscreen.frag
````
varying vec2 vUv;

uniform float time;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
uniform sampler2D texture;

void main() {

	vec2 uv = vUv;
	// vec4 color = texture2D( texture, vUv );

	vec4 origColor = texture2D(texture, vUv);

	// remove green
	if ( origColor.r < 0.4 && origColor.b < 0.4 && origColor.g > 0.4 ) {
		origColor.a = 0.;
	}

	if ( origColor.r < 0.9 && origColor.b < 0.9 && origColor.g > 0.9 ) {
		origColor.a = 0.;
	}

	// vec4 gradientImage = mix(vec4( gradientColor, 1.0), vec4(1.0, 1.0, 1.0, 1.0), grayscaleValue);

	// if ( gradientImage.b < 0.9 ) discard;

	// gl_FragColor = origColor * opacity;
	gl_FragColor = origColor;

	#ifdef USE_FOG
		#ifdef USE_LOGDEPTHBUF_EXT
			float depth = gl_FragDepthEXT / gl_FragCoord.w;
		#else
			float depth = gl_FragCoord.z / gl_FragCoord.w;
		#endif
		float fogFactor = smoothstep( fogNear, fogFar, depth );
		gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
	#endif

}
````

## File: src/features/3d/3d-timeline-journey/shaders/item.frag
````
varying vec2 vUv;

uniform float time;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
uniform sampler2D texture;
uniform float opacity;
uniform vec3 gradientColor;
uniform float progress;

void main() {

	vec2 uv = vUv;
	// vec4 color = texture2D( texture, vUv );

	vec4 origColor = texture2D(texture, vUv);
    float grayscaleValue = dot(origColor.rgb, vec3(0.299, 0.587, 0.114));

	// remove green
	// if ( origColor.r < 0.4 && origColor.b < 0.4 && origColor.g > 0.4 ) {
	// 	origColor.a = 0.;
	// }

	// if ( origColor.r < 0.9 && origColor.b < 0.9 && origColor.g > 0.9 ) {
	// 	origColor.a = 0.;
	// }

	vec4 gradientImage = mix(vec4( gradientColor, 1.0), vec4(1.0, 1.0, 1.0, 1.0), grayscaleValue);

	// if ( gradientImage.b < 0.9 ) discard;

	// gl_FragColor = origColor * opacity;
	gl_FragColor = mix( vec4( gradientImage.rgb, 0. ), mix( gradientImage, origColor, progress ), opacity );

	#ifdef USE_FOG
		#ifdef USE_LOGDEPTHBUF_EXT
			float depth = gl_FragDepthEXT / gl_FragCoord.w;
		#else
			float depth = gl_FragCoord.z / gl_FragCoord.w;
		#endif
		float fogFactor = smoothstep( fogNear, fogFar, depth );
		gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
	#endif

}
````

## File: src/features/3d/3d-timeline-journey/stories/data.ts
````typescript

````

## File: src/features/3d/3d-timeline-journey/utils/progressPromise.ts
````typescript
export default function progressPromise<T>(
  promises: Promise<T>[],
  tickCallback: (progress: number, total: number) => void
): Promise<T[]>
⋮----
function tick(promise: Promise<T>): Promise<T>
````

## File: src/features/3d/3d-timeline-journey/utils/useAssetLoader.tsx
````typescript
import { useMemo } from 'react'
⋮----
import progressPromise from './progressPromise'
import { useLoader } from '@react-three/fiber'
import { TextureLoader, VideoTexture, LinearFilter } from 'three'
interface AssetLoaderProps {
  assetList: { [key: string]: string[] }
  isMobile: boolean
}
export function useAssetLoader(
````

## File: src/features/3d/3d-timeline-journey/3d-timeline-journey.tsx
````typescript
import { Timeline } from './timeline'
export interface ThreeDTimelineJourneyProps {
  events: any
  experts: any
}
export const ThreeDTimelineJourney: React.FC<ThreeDTimelineJourneyProps> = ({
  events,
  experts,
}: ThreeDTimelineJourneyProps) =>
````

## File: src/features/3d/3d-timeline-journey/index.tsx
````typescript

````

## File: src/features/3d/3d-timeline-journey/section.tsx
````typescript
import { useMemo, useRef } from 'react'
import {
  Group,
  Mesh,
  Vector2,
  PlaneGeometry,
  ShaderMaterial,
  Color,
  MeshBasicMaterial,
} from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { Item } from './item'
import { months } from './config/months'
interface SectionProps {
  month: string
  items: string[]
  data: any
  assets: any
  position?: [number, number, number]
}
````

## File: src/features/3d/3d-timeline-journey/timeline.tsx
````typescript
import {
  forwardRef,
  Suspense,
  useEffect,
  useRef,
  useState,
  type JSXElementConstructor,
  type PromiseLikeOfReactNode,
  type ReactElement,
  type ReactNode,
} from 'react'
import {
  Text,
  Html,
  Plane,
  ScrollControls,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  useScroll,
  Scroll,
  useTexture,
  Image,
  MeshPortalMaterial,
  CameraControls,
  TransformControls,
} from '@react-three/drei'
import {
  useEventsStore,
  useTimelineConfig,
} from '../../../hooks/useTimelineConfig'
import { MultiStepLoader } from '@/components/multistep-loader'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { palette } from '@/utils/constants/colors'
import { geometry } from 'maath'
⋮----
interface IntroSectionProps { }
⋮----
onPointerOver=
⋮----
onPointerOut=
⋮----
function ScrollContainer(
````

## File: src/features/3d/dna-visualization/DnaPage.tsx
````typescript
import {DnaVisualization} from './DnaVisualization'
export function DnaPage()
````

## File: src/features/3d/dna-visualization/DnaVisualization.stories.tsx
````typescript
import type {Meta, StoryObj} from '@storybook/react'
import {DnaVisualization} from './DnaVisualization'
⋮----
type Story = StoryObj<typeof DnaVisualization>
````

## File: src/features/3d/dna-visualization/DnaVisualization.tsx
````typescript
import React, {useEffect, useRef} from 'react'
⋮----
function randn_bm()
interface DnaVisualizationProps {
  className?: string
}
⋮----
const computeTargetPositions = (model = 'none') =>
⋮----
const computeMatrix = () =>
⋮----
const render = () =>
⋮----
const observerCallback = (entries: IntersectionObserverEntry[]) =>
````

## File: src/features/3d/dna-visualization/index.ts
````typescript

````

## File: src/features/3d/drawing-board/command-menu.tsx
````typescript
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/utils'
import {
  type LucideIcon,
  HelpCircle,
  Circle,
  ArrowUpCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { useState, useEffect } from 'react'
type ModelView = {
  value: string
  label: string
  icon: LucideIcon
}
⋮----
const down = ( e: KeyboardEvent ) =>
⋮----
setSelectedView(
setOpen( false )
````

## File: src/features/3d/drawing-board/drawing-board__d3.tsx
````typescript
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { DotGridBackground } from '@/components/backgrounds'
import { Canvas, useFrame } from '@react-three/fiber'
import { a, useTransition, useSpring } from '@react-spring/three'
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
} from 'd3-force'
import {
  OrbitControls,
  Text,
  Html,
  Plane,
  ContactShadows,
  Text3D,
} from '@react-three/drei'
⋮----
import { Spotlight } from '@/components/animated/spotlight'
import { motion } from 'framer-motion'
import { Flex, Box } from '@react-three/flex'
import type { NetworkGraphPayload } from '@/db/xata'
import {
  StarsCard,
  StarsCardTitle,
  StarsCardDescription,
} from '@/components/ui/card/stars-card'
````

## File: src/features/3d/drawing-board/drawing-board.tsx
````typescript
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { DotGridBackground } from '@/components/backgrounds'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { a, useTransition, useSpring } from '@react-spring/three'
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
} from 'd3-force'
import {
  OrbitControls,
  Text,
  Html,
  Plane,
  ContactShadows,
  Text3D,
  useAspect,
} from '@react-three/drei'
⋮----
import { Spotlight } from '@/components/animated/spotlight'
import { motion } from 'framer-motion'
import { Flex, Box } from '@react-three/flex'
import {
  StarsCard,
  StarsCardTitle,
  StarsCardDescription,
} from '@/components/ui/card/stars-card'
const testCard = () =>
````

## File: src/features/3d/drawing-board/entity-menu.tsx
````typescript
import React, { useState } from "react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion"
import { cn } from "@/utils/cn"
import Link from "next/link"
export default function EntityMenu()
⋮----
className=
````

## File: src/features/3d/drawing-board/graph.tsx
````typescript
import { useState, createRef, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Nodes, Node } from './nodes'
import type { DrawingBoardProps } from '@/features/3d/drawing-board/drawing-board'
import { Spotlight } from '@/components/animated/spotlight'
import { DotGridBackground } from '@/components/backgrounds'
import { ArrowIcon } from '@/components/ui/icons/arrow'
import { FloatingEntityMenu } from '@/features/3d/drawing-board/entity-menu'
import { SmartCommandMenu } from '@/features/3d/drawing-board/command-menu'
import {
  CycleRaycast,
  DragControls,
  OrbitControls,
  Preload,
  ScrollControls,
  TrackballControls,
} from '@react-three/drei'
import dynamic from 'next/dynamic'
import { View } from '@/features/3d/canvas/View'
import { r3f } from '@/features/3d/helpers/global'
import { use3DGraph } from '@/hooks/use3dGraph'
````

## File: src/features/3d/drawing-board/index.tsx
````typescript

````

## File: src/features/3d/globe-connections/cities.json
````json
[
  {
    "city_ascii": "Tokyo",
    "lat": 35.685,
    "lng": 139.7514,
    "country": "Japan",
    "AR": "GR",
    "population": 35676000
  },
  {
    "city_ascii": "New York",
    "lat": 40.6943,
    "lng": -73.9249,
    "country": "United States",
    "AR": "US",
    "population": 19354922
  },
  {
    "city_ascii": "Mexico City",
    "lat": 19.4424,
    "lng": -99.131,
    "country": "Mexico",
    "AR": "CN",
    "population": 19028000
  },
  {
    "city_ascii": "Mumbai",
    "lat": 19.017,
    "lng": 72.857,
    "country": "India",
    "AR": "US",
    "population": 18978000
  },
  {
    "city_ascii": "Sao Paulo",
    "lat": -23.5587,
    "lng": -46.625,
    "country": "Brazil",
    "AR": "ES",
    "population": 18845000
  },
  {
    "city_ascii": "Delhi",
    "lat": 28.67,
    "lng": 77.23,
    "country": "India",
    "AR": "RU",
    "population": 15926000
  },
  {
    "city_ascii": "Shanghai",
    "lat": 31.2165,
    "lng": 121.4365,
    "country": "China",
    "AR": "MX",
    "population": 14987000
  },
  {
    "city_ascii": "Kolkata",
    "lat": 22.495,
    "lng": 88.3247,
    "country": "India",
    "AR": "NG",
    "population": 14787000
  },
  {
    "city_ascii": "Los Angeles",
    "lat": 34.1139,
    "lng": -118.4068,
    "country": "United States",
    "AR": "GT",
    "population": 12815475
  },
  {
    "city_ascii": "Dhaka",
    "lat": 23.7231,
    "lng": 90.4086,
    "country": "Bangladesh",
    "AR": "ZM",
    "population": 12797394
  },
  {
    "city_ascii": "Buenos Aires",
    "lat": -34.6025,
    "lng": -58.3975,
    "country": "Argentina",
    "AR": "FR",
    "population": 12795000
  },
  {
    "city_ascii": "Karachi",
    "lat": 24.87,
    "lng": 66.99,
    "country": "Pakistan",
    "AR": "NG",
    "population": 12130000
  },
  {
    "city_ascii": "Cairo",
    "lat": 30.05,
    "lng": 31.25,
    "country": "Egypt",
    "AR": "RU",
    "population": 11893000
  },
  {
    "city_ascii": "Rio de Janeiro",
    "lat": -22.925,
    "lng": -43.225,
    "country": "Brazil",
    "AR": "US",
    "population": 11748000
  },
  {
    "city_ascii": "Osaka",
    "lat": 34.75,
    "lng": 135.4601,
    "country": "Japan",
    "AR": "CN",
    "population": 11294000
  },
  {
    "city_ascii": "Beijing",
    "lat": 39.9289,
    "lng": 116.3883,
    "country": "China",
    "AR": "IR",
    "population": 11106000
  },
  {
    "city_ascii": "Manila",
    "lat": 14.6042,
    "lng": 120.9822,
    "country": "Philippines",
    "AR": "AR",
    "population": 11100000
  },
  {
    "city_ascii": "Moscow",
    "lat": 55.7522,
    "lng": 37.6155,
    "country": "Russia",
    "AR": "TH",
    "population": 10452000
  },
  {
    "city_ascii": "Istanbul",
    "lat": 41.105,
    "lng": 29.01,
    "country": "Turkey",
    "AR": "KR",
    "population": 10061000
  },
  {
    "city_ascii": "Paris",
    "lat": 48.8667,
    "lng": 2.3333,
    "country": "France",
    "AR": "FR",
    "population": 9904000
  },
  {
    "city_ascii": "Seoul",
    "lat": 37.5663,
    "lng": 126.9997,
    "country": "Korea, South",
    "AR": "US",
    "population": 9796000
  },
  {
    "city_ascii": "Lagos",
    "lat": 6.4433,
    "lng": 3.3915,
    "country": "Nigeria",
    "AR": "BR",
    "population": 9466000
  },
  {
    "city_ascii": "Jakarta",
    "lat": -6.1744,
    "lng": 106.8294,
    "country": "Indonesia",
    "AR": "BR",
    "population": 9125000
  },
  {
    "city_ascii": "Guangzhou",
    "lat": 23.145,
    "lng": 113.325,
    "country": "China",
    "AR": "BR",
    "population": 8829000
  },
  {
    "city_ascii": "Chicago",
    "lat": 41.8373,
    "lng": -87.6861,
    "country": "United States",
    "AR": "LV",
    "population": 8675982
  },
  {
    "city_ascii": "London",
    "lat": 51.5,
    "lng": -0.1167,
    "country": "United Kingdom",
    "AR": "AU",
    "population": 8567000
  },
  {
    "city_ascii": "Lima",
    "lat": -12.048,
    "lng": -77.0501,
    "country": "Peru",
    "AR": "SN",
    "population": 8012000
  },
  {
    "city_ascii": "Tehran",
    "lat": 35.6719,
    "lng": 51.4243,
    "country": "Iran",
    "AR": "AR",
    "population": 7873000
  },
  {
    "city_ascii": "Kinshasa",
    "lat": -4.3297,
    "lng": 15.315,
    "country": "Congo (Kinshasa)",
    "AR": "CR",
    "population": 7843000
  },
  {
    "city_ascii": "Bogota",
    "lat": 4.5964,
    "lng": -74.0833,
    "country": "Colombia",
    "AR": "FR",
    "population": 7772000
  },
  {
    "city_ascii": "Shenzhen",
    "lat": 22.5524,
    "lng": 114.1221,
    "country": "China",
    "AR": "US",
    "population": 7581000
  },
  {
    "city_ascii": "Wuhan",
    "lat": 30.58,
    "lng": 114.27,
    "country": "China",
    "AR": "CA",
    "population": 7243000
  },
  {
    "city_ascii": "Hong Kong",
    "lat": 22.305,
    "lng": 114.185,
    "country": "Hong Kong",
    "AR": "LA",
    "population": 7206000
  },
  {
    "city_ascii": "Tianjin",
    "lat": 39.13,
    "lng": 117.2,
    "country": "China",
    "AR": "US",
    "population": 7180000
  },
  {
    "city_ascii": "Chennai",
    "lat": 13.09,
    "lng": 80.28,
    "country": "India",
    "AR": "ID",
    "population": 7163000
  },
  {
    "city_ascii": "Taipei",
    "lat": 25.0358,
    "lng": 121.5683,
    "country": "Taiwan",
    "AR": "CM",
    "population": 6900273
  },
  {
    "city_ascii": "Bangalore",
    "lat": 12.97,
    "lng": 77.56,
    "country": "India",
    "AR": "US",
    "population": 6787000
  },
  {
    "city_ascii": "Bangkok",
    "lat": 13.75,
    "lng": 100.5166,
    "country": "Thailand",
    "AR": "US",
    "population": 6704000
  },
  {
    "city_ascii": "Lahore",
    "lat": 31.56,
    "lng": 74.35,
    "country": "Pakistan",
    "AR": "US",
    "population": 6577000
  },
  {
    "city_ascii": "Chongqing",
    "lat": 29.565,
    "lng": 106.595,
    "country": "China",
    "AR": "CN",
    "population": 6461000
  },
  {
    "city_ascii": "Miami",
    "lat": 25.784,
    "lng": -80.2102,
    "country": "United States",
    "AR": "US",
    "population": 6381966
  },
  {
    "city_ascii": "Hyderabad",
    "lat": 17.4,
    "lng": 78.48,
    "country": "India",
    "AR": "BO",
    "population": 6376000
  },
  {
    "city_ascii": "Dallas",
    "lat": 32.7937,
    "lng": -96.7662,
    "country": "United States",
    "AR": "RU",
    "population": 5733259
  },
  {
    "city_ascii": "Santiago",
    "lat": -33.45,
    "lng": -70.667,
    "country": "Chile",
    "AR": "US",
    "population": 5720000
  },
  {
    "city_ascii": "Philadelphia",
    "lat": 40.0076,
    "lng": -75.134,
    "country": "United States",
    "AR": "BR",
    "population": 5637884
  },
  {
    "city_ascii": "Belo Horizonte",
    "lat": -19.915,
    "lng": -43.915,
    "country": "Brazil",
    "AR": "US",
    "population": 5575000
  },
  {
    "city_ascii": "Madrid",
    "lat": 40.4,
    "lng": -3.6834,
    "country": "Spain",
    "AR": "US",
    "population": 5567000
  },
  {
    "city_ascii": "Houston",
    "lat": 29.7868,
    "lng": -95.3905,
    "country": "United States",
    "AR": "UG",
    "population": 5446468
  },
  {
    "city_ascii": "Ahmedabad",
    "lat": 23.0301,
    "lng": 72.58,
    "country": "India",
    "AR": "RU",
    "population": 5375000
  },
  {
    "city_ascii": "Ho Chi Minh City",
    "lat": 10.78,
    "lng": 106.695,
    "country": "Vietnam",
    "AR": "ZA",
    "population": 5314000
  }
]
````

## File: src/features/3d/globe-connections/ConnectionsFacade.tsx
````typescript
import { Group3DFacade } from 'troika-3d'
import { Vector3 } from 'three'
import { Bezier3DInstanceableFacade } from '@/features/3d/globe-connections/bezier-3d-facade'
⋮----
class ConnectionsFacade extends Group3DFacade
⋮----
constructor( parent )
````

## File: src/features/3d/globe-connections/Globe.stories.tsx
````typescript
import type { Meta, StoryObj } from '@storybook/react'
import Globe from './Globe'
import { Canvas3D } from 'troika-3d'
````

## File: src/features/3d/globe-connections/Globe.tsx
````typescript
import { Object3DFacade, createDerivedMaterial } from 'troika-3d'
import {
  BackSide,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3
} from 'three'
import geojson from './countries.geojson.json'
⋮----
const pushCoords = ([lon, lat]) =>
⋮----
const handleCoordsGroup = coordsGroup => {
for (let i = 0, iLen = coordsGroup.length; i < iLen; i++)
⋮----
class Globe extends Object3DFacade
⋮----
constructor (parent)
latLonToLocalPosition(lat, lon, radius = 1)
latLonToWorldPosition(lat, lon, radius)
````

## File: src/features/3d/globe-connections/GlobeConnectionsExample.stories.tsx
````typescript
import type { Meta, StoryObj } from '@storybook/react'
import GlobeConnections from './GlobeConnectionsExample'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/features/3d/globe-connections/GlobeConnectionsExample.tsx
````typescript
import React, { useState, useRef } from 'react'
import { Canvas3D, Group3DFacade, ListFacade } from 'troika-3d'
import { UIBlock3DFacade } from 'troika-3d-ui'
import Globe from './Globe'
import XRGrabbable from './XRGrabbable'
import ConnectionsFacade from './ConnectionsFacade'
import cities from './cities.json'
import { Matrix4 } from 'three'
⋮----
const GlobeConnections = (props: {
  width: any
  height: any
  stats: any
  vr: any
}) =>
⋮----
const onFacadeRef = (name: string, facade: any) =>
````

## File: src/features/3d/globe-connections/XRGrabbable.tsx
````typescript
import { Group3DFacade } from 'troika-3d'
import { Matrix4, Vector3, Quaternion } from 'three'
⋮----
export default class XRGrabbable extends Group3DFacade
⋮----
constructor(parent)
_onSqueezeStart(e)
_onSqueezeEnd(e)
updateMatrices ()
_onBeforeRender()
destructor ()
````

## File: src/features/3d/scroll-through-3d/model.tsx
````typescript
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations, PerspectiveCamera } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
⋮----
const handleContextLost = (event: any) =>
⋮----
e.stopPropagation(), setHovered(e.object.name)
````

## File: src/features/3d/scroll-through-3d/path-journey.tsx
````typescript
import {Canvas, extend, useFrame, useThree} from '@react-three/fiber'
import {Text} from '@react-three/drei'
import {PerspectiveCamera} from 'three/webgpu'
import {OrbitControls, TransformControls} from 'three-stdlib'
⋮----
interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
⋮----
const NoiseEffect = () =>
export const ScanLineEffect = () =>
````

## File: src/features/3d/scroll-through-3d/ScrollThrough3dWrapper.tsx
````typescript
import {Suspense, useEffect, useRef} from 'react'
import gsap from 'gsap'
import {ScrollThrough3D} from '@/features/3d/scroll-through-3d/ScrollThroughThreeD'
import {Loading} from '@/components/loaders/loading'
interface Section {
  id: string
  title: string
}
interface ScrollThroughWrapperProps {
  sections: Section[]
  years: number[]
}
export function ScrollThroughWrapper(
````

## File: src/features/3d/ufos/ufo/Scene.jsx
````javascript
export function UfoScene(props) {
const {nodes, materials} = useGLTF('/assets/ufo/scene.gltf')
⋮----
useGLTF.preload('/assets/ufo/scene.gltf')
````

## File: src/features/3d/ufos/ufo/ufo-model.tsx
````typescript
import { useGLTF } from '@react-three/drei'
import { GroupProps } from '@react-three/fiber'
import { Material, Mesh } from 'three'
type UfoModelProps = GroupProps & {
  scale?: number | [number, number, number]
}
type GLTFResult = {
  nodes: {
    Circle001_0: Mesh
    Circle001_1: Mesh
  }
  materials: {
    'Material.001': Material
    'Material.002': Material
  }
}
````

## File: src/features/3d/ufos/ufo/ufo.stories.tsx
````typescript
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import type { Meta, StoryObj } from '@storybook/react'
import { UfoScene } from './Scene'
````

## File: src/features/3d/ufos/ufo-alt/Scene.jsx
````javascript
export function Model(props) {
const { nodes, materials } = useGLTF('/scene-transformed.glb')
⋮----
useGLTF.preload('/scene-transformed.glb')
````

## File: src/features/3d/visualizations/3d-grid/3d-grid.tsx
````typescript
import React, { useRef, useEffect, forwardRef, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import {
  PerspectiveCamera,
  OrbitControls,
  Html,
  Billboard,
  Text,
  TrackballControls,
} from '@react-three/drei'
⋮----
const Card = (
⋮----
<Card key=
````

## File: src/features/3d/visualizations/3d-grid/index.tsx
````typescript

````

## File: src/features/3d/visualizations/diagram/graph-visualization.tsx
````typescript
import { ThreeDGraph } from './3d-graph'
import { TrackballControls, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
export const GraphVisualization = (
````

## File: src/features/3d/visualizations/diagram/index.tsx
````typescript

````

## File: src/features/3d/visualizations/diagram/scroll-controls.tsx
````typescript
import { context as fiberContext, useFrame, useThree } from '@react-three/fiber'
import mergeRefs from 'react-merge-refs'
export type ScrollControlsProps = {
  eps?: number
  horizontal?: boolean
  infinite?: boolean
  pages?: number
  distance?: number
  damping?: number
  enabled?: boolean
  children: React.ReactNode
}
export type ScrollControlsState = {
  el: HTMLDivElement
  eps: number
  fill: HTMLDivElement
  fixed: HTMLDivElement
  horizontal: boolean | undefined
  damping: number
  offset: number
  delta: number
  pages: number
  range(from: number, distance: number, margin?: number): number
  curve(from: number, distance: number, margin?: number): number
  visible(from: number, distance: number, margin?: number): boolean
}
⋮----
range(from: number, distance: number, margin?: number): number
curve(from: number, distance: number, margin?: number): number
visible(from: number, distance: number, margin?: number): boolean
⋮----
export function useScroll()
export function ScrollControls({
  eps = 0.00001,
  enabled = true,
  infinite,
  horizontal,
  pages = 1,
  distance = 1,
  damping = 4,
  children,
}: ScrollControlsProps)
⋮----
range(from: number, distance: number, margin: number = 0)
curve(from: number, distance: number, margin: number = 0)
visible(from: number, distance: number, margin: number = 0)
⋮----
const onScroll = (e: any) =>
⋮----
const onWheel = (e: any)
⋮----
return <group ref=
⋮----
type ScrollProps = {
  html?: boolean
  children?: React.ReactNode
}
````

## File: src/features/3d/visualizations/diagram/spherical-connection-graph.tsx
````typescript
import { Canvas } from '@react-three/fiber'
import {
  createRef,
  useCallback,
  useState
} from 'react'
⋮----
import { Node, Nodes } from './nodes'
import { DOMAIN_MODEL_COLORS } from '@/utils/constants/colors'
import {
  OrbitControls,
  TrackballControls
} from '@react-three/drei'
⋮----
const calculatePosition = ( index: any, length: any ) =>
⋮----
position=
````

## File: src/features/3d/visualizations/graph/index.tsx
````typescript

````

## File: src/features/3d/visualizations/graph/rtf-graph.tsx
````typescript
import { useEffect, useRef } from 'react'
import {
  GraphCanvas,
  lightTheme,
  useSelection
} from 'reagraph'
⋮----
import { useModelNodes } from './useModelNodes'
import { TopicPersonnelAndEventGraphDataPayload } from '@/db/xata'
import {
  Image,
  Text
} from '@react-three/drei'
⋮----
// useFrame((state, dt) => {
//   image.current.material.zoom =
//     2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
//   easing.damp3(
//     image.current.scale,
//     [
//       0.85 * (!isActive && hovered ? 0.85 : 1),
//       0.9 * (!isActive && hovered ? 0.905 : 1),
//       1,
//     ],
//     0.1,
//     dt
//   )
//   easing.dampC(
//     frame.current.material.color,
//     hovered ? 'orange' : 'white',
````

## File: src/features/3d/visualizations/graph/useModelNodes.tsx
````typescript
import { DOMAIN_MODEL_COLORS } from '@/utils/constants/colors'
import { useState, useEffect, useMemo } from 'react'
interface ModelNodesProps {
  models: any
}
⋮----
export const useModelNodes = (
⋮----
const createNodeAndEdge = ( rootNode, models, color ) =>
````

## File: src/features/3d/visualizations/spatial-gallery/events.ts
````typescript

````

## File: src/features/3d/visualizations/spatial-gallery/index.tsx
````typescript

````

## File: src/features/3d/visualizations/spatial-gallery/spatial-gallery.tsx
````typescript
import { forwardRef, Suspense, useEffect, useRef, useState } from 'react'
import {
  Canvas,
  useFrame,
  extend,
  useLoader,
  useGraph,
} from '@react-three/fiber'
import {
  useCursor,
  MeshReflectorMaterial,
  Text,
  Environment,
  Html,
  useTexture,
  Preload,
} from '@react-three/drei'
import { useRouter, useSearchParams } from 'next/navigation'
import { easing, geometry } from 'maath'
import NextImage from 'next/image'
⋮----
onPointerOver=
````

## File: src/features/3d/visualizations/word-cloud/index.tsx
````typescript

````

## File: src/features/3d/visualizations/word-cloud/word-cloud.tsx
````typescript
import { Html, TrackballControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { Suspense, useRef, useState, memo } from "react";
⋮----
import { Loading } from "@/components/loaders/loading";
import { Card, CardHeader } from "@/components/ui/card";
import { ModelAvatar } from "@/features/mindmap/components/connection-list";
import { cn } from "@/utils";
import { DOMAIN_MODEL_COLORS } from "@/utils/constants/colors";
import { motion } from "framer-motion";
````

## File: src/features/3d/video.tsx
````typescript
import { useState, useEffect } from 'react'
````

## File: src/features/admin/ui/columns.tsx
````typescript

````

## File: src/features/admin/ui/RecordsTable.tsx
````typescript
import React, { useEffect } from 'react'
import Image from 'next/image'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableConfig } from '@/features/admin/ui/columns'
import { Badge } from '@/components/ui/badge'
import {
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { AnimatedGridPatternBackground } from '@/components/backgrounds/animated-grid-pattern'
import { Input } from '@/components/ui/input'
⋮----
const handleRowClick = (
⋮----
className=
````

## File: src/features/admin/ui/SelectedRecordsList.tsx
````typescript
import React, { useEffect } from 'react'
import { useCallback, useState } from 'react'
import { Plus, RepeatIcon, Settings2Icon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRenderListItem } from './useRenderListItem'
import {
  SortableList,
  type Item,
  SortableListItem,
} from '@/components/cult-ui/sortable-list'
export function SelectedRecordsList(
⋮----
const handleCompleteItem = ( id: number ) =>
const handleAddItem = () =>
const handleResetItems = () =>
````

## File: src/features/admin/ui/useRenderListItem.tsx
````typescript
import React, { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { DirectionAwareTabs } from '@/components/ui/direction-aware-tabs'
import { AnimatePresence, LayoutGroup, motion, useInView } from 'framer-motion'
import { Plus, RepeatIcon, Settings2Icon, XIcon } from 'lucide-react'
import { cn } from '@/utils'
import { Button } from '@/components/ui/button'
import {
  type Item,
  SortableListItem,
} from '@/components/cult-ui/sortable-list'
````

## File: src/features/admin/Admin.tsx
````typescript
export interface AdminProps {}
export const Admin: React.FC<AdminProps> = (props: AdminProps) =>
````

## File: src/features/admin/AdminDashboard.tsx
````typescript
import {
  AppSidebar,
  AppSidebarBody,
  AppSidebarLink,
} from '@/components/app-sidebar'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'
import { motion } from 'framer-motion'
import {
  ArrowBigLeft,
  LayoutDashboardIcon,
  Search,
  Settings,
  User
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import {
  getEvents,
  getKeyFigures,
  getOrganizations,
  getTestimonies,
  getTopics,
} from '@/app/(auth)/admin/actions'
import { RecordsTable } from '@/features/admin/ui/RecordsTable'
import { SelectedRecordsList } from './ui/SelectedRecordsList'
import { DotPattern } from '@/components/backgrounds'
import { AdminDashboardGlobe } from '@/components/globes/cobe-globes'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
⋮----
const makeLinks = ( updateCurrentSection )
⋮----
const updateCurrentSection = ( model: string ) =>
````

## File: src/features/admin/index.tsx
````typescript

````

## File: src/features/ai/actions/chat.actions.tsx
````typescript
import { Message } from '@/features/ai/components/message'
import type { ReactNode } from 'react'
import { generateId } from 'ai'
import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import { OpenAI } from 'openai'
⋮----
export interface ClientMessage {
  id: string
  status: ReactNode
  text: ReactNode
  gui: ReactNode
}
⋮----
export const streamNodeUpdate = ( node: any ) =>
````

## File: src/features/ai/ai-app-assistant/assistant-ui/markdown-text.tsx
````typescript
import {
  CodeHeaderProps,
  MarkdownTextPrimitive,
  unstable_memoizeMarkdownComponents as memoizeMarkdownComponents,
  useIsMarkdownCodeBlock,
} from "@assistant-ui/react-markdown";
import remarkGfm from "remark-gfm";
import { FC, memo, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { cn } from "@/utils";
const MarkdownTextImpl = () =>
⋮----
const CodeHeader: FC<CodeHeaderProps> = (
⋮----
const onCopy = () =>
⋮----
const useCopyToClipboard = ({
  copiedDuration = 3000,
}: {
  copiedDuration?: number;
} =
⋮----
const copyToClipboard = (value: string) =>
⋮----
className={cn(!isCodeBlock && "bg-gray-100 rounded border border-gray-200 font-semibold dark:bg-gray-800 dark:border-gray-800", className)}
        {...props}
      />
    );
````

## File: src/features/ai/ai-app-assistant/assistant-ui/thread-list.tsx
````typescript
import type { FC } from "react";
import {
  ThreadListItemPrimitive,
  ThreadListPrimitive,
} from "@assistant-ui/react";
import { ArchiveIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
export const ThreadList: FC = () =>
const ThreadListNew: FC = () =>
const ThreadListItems: FC = () =>
const ThreadListItem: FC = () =>
const ThreadListItemTitle: FC = () =>
const ThreadListItemArchive: FC = () =>
````

## File: src/features/ai/ai-app-assistant/assistant-ui/thread.tsx
````typescript
import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import type { FC } from "react";
import {
  ArrowDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PencilIcon,
  RefreshCwIcon,
  SendHorizontalIcon,
} from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
⋮----
className=
⋮----
const CircleStopIcon = () =>
````

## File: src/features/ai/ai-app-assistant/assistant-ui/tooltip-icon-button.tsx
````typescript
import { ComponentPropsWithoutRef, forwardRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
export type TooltipIconButtonProps = ComponentPropsWithoutRef<typeof Button> & {
  tooltip: string;
  side?: "top" | "bottom" | "left" | "right";
};
⋮----
className=
````

## File: src/features/ai/ai-app-assistant/full-chat-interface/app-sidebar.tsx
````typescript
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  RiChat1Line,
  RiBardLine,
  RiMickeyLine,
  RiMicLine,
  RiCheckDoubleLine,
  RiBracesLine,
  RiPlanetLine,
  RiSeedlingLine,
  RiSettings3Line,
} from "@remixicon/react";
````

## File: src/features/ai/ai-app-assistant/full-chat-interface/banner.tsx
````typescript
import { RiCloseLine } from "@remixicon/react";
import { useState } from "react";
````

## File: src/features/ai/ai-app-assistant/full-chat-interface/chat-interface.tsx
````typescript
import {SidebarInset, SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar'
import {AppSidebar} from '@/features/ai/ai-app-assistant/full-chat-interface/app-sidebar'
import {
  SettingsPanelProvider,
  SettingsPanel,
} from '@/features/ai/ai-app-assistant/full-chat-interface/settings-panel'
import UserDropdown from '@/features/ai/ai-app-assistant/full-chat-interface/user-dropdown'
import {Chat} from 'openai/resources/chat'
export function ChatInterface()
````

## File: src/features/ai/ai-app-assistant/full-chat-interface/chat-message.tsx
````typescript
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  RiCodeSSlashLine,
  RiBookLine,
  RiLoopRightFill,
  RiCheckLine,
} from "@remixicon/react";
type ChatMessageProps = {
  isUser?: boolean;
  children: React.ReactNode;
};
````

## File: src/features/ai/ai-app-assistant/full-chat-interface/chat.tsx
````typescript
import {SettingsPanelTrigger} from './settings-panel'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {Button} from '@/components/ui/button'
import {ScrollArea} from '@/components/ui/scroll-area'
import {ChatMessage} from './chat-message'
import {useRef, useEffect} from 'react'
````

## File: src/features/ai/ai-app-assistant/full-chat-interface/settings-panel.tsx
````typescript
import { useIsMobile } from "@/hooks/use-mobile";
import { RiQuillPenAiLine, RiSettingsLine } from "@remixicon/react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SliderControl from "@/components/slider-control";
import { Sheet, SheetTitle, SheetContent } from "@/components/ui/sheet";
⋮----
import { ScrollArea } from "@/components/ui/scroll-area";
type SettingsPanelContext = {
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  togglePanel: () => void;
};
⋮----
function useSettingsPanel()
const SettingsPanelProvider = (
⋮----
onClick?.(event);
togglePanel();
````

## File: src/features/ai/ai-app-assistant/full-chat-interface/slider-control.tsx
````typescript
import { useSliderWithInput } from "@/hooks/use-slider-with-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RiRefreshLine } from "@remixicon/react";
import { cn } from "@workspace/ui/lib/utils";
interface SliderControlProps {
  className?: string;
  minValue: number;
  maxValue: number;
  initialValue: [number];
  defaultValue: [number];
  step: number;
  label: string;
}
````

## File: src/features/ai/ai-app-assistant/full-chat-interface/team-switcher.tsx
````typescript
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { RiExpandUpDownLine, RiAddLine } from "@remixicon/react";
````

## File: src/features/ai/ai-app-assistant/full-chat-interface/user-dropdown.tsx
````typescript
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  RiLogoutCircleLine,
  RiTimer2Line,
  RiUserLine,
  RiFindReplaceLine,
  RiPulseLine,
} from "@remixicon/react";
````

## File: src/features/ai/ai-app-assistant/ai-components.tsx
````typescript
import {makeAssistantVisible} from '@assistant-ui/react'
⋮----
function TransactionHistory(
import {useAssistantInstructions} from '@assistant-ui/react'
export function SmartTransactionHistory()
function SmartTransactionHistory(
````

## File: src/features/ai/ai-app-assistant/assistant.tsx
````typescript
import {
  AssistantRuntimeProvider,
  ComposerPrimitive,
  CompositeAttachmentAdapter,
  makeAssistantToolUI,
  MessagePrimitive,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from '@assistant-ui/react'
import {useChatRuntime} from '@assistant-ui/react-ai-sdk'
import {Thread} from '@/components/assistant-ui/thread'
import {ThreadList} from '@/components/assistant-ui/thread-list'
import {CustomAttachmentAdapter, WebSearchToolUI} from '@/features/ai/ai-app-assistant/tools'
⋮----
const Composer = () =>
const UserMessage = () =>
const Assistant = () =>
````

## File: src/features/ai/ai-app-assistant/tools.tsx
````typescript
import {makeAssistantToolUI} from '@assistant-ui/react'
import {
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from '@assistant-ui/react'
import {
  ComposerAttachments,
  ComposerAddAttachment,
  UserMessageAttachments,
} from '@/components/assistant-ui/attachment'
import type {AttachmentAdapter} from '@assistant-ui/react'
export type WebSearchArgs = {
  query: string
}
export type WebSearchResult = {
  title: string
  description: string
  url: string
}
⋮----
export class CustomAttachmentAdapter implements AttachmentAdapter
⋮----
async add(
async send(attachment)
async remove()
````

## File: src/features/ai/api/actions.tsx
````typescript
import { Message } from '@/features/ai/components/message'
import type { ReactNode } from 'react'
import { generateId } from 'ai'
import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import { OpenAI } from 'openai'
⋮----
export interface ClientMessage {
  id: string
  status: ReactNode
  text: ReactNode
  gui: ReactNode
}
⋮----
export const streamNodeUpdate = ( node: any ) =>
````

## File: src/features/ai/components/ai-inputs/ai-inputs.tsx
````typescript

````

## File: src/features/ai/components/ai-inputs/ai-oracle.tsx
````typescript
import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight, Clock, Copy, Plus, Settings, Sparkles } from 'lucide-react'
import { useState } from "react"
interface Task {
  id: string
  content: string
  status: "pending" | "in_progress" | "done"
}
````

## File: src/features/ai/components/chat-interface/chat-bottombar.tsx
````typescript
import {
	FileImage,
	Mic,
	Paperclip,
	PlusCircle,
	SendHorizontal,
	ThumbsUp,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/features/mindmap/components/note/ui/Textarea";
import { cn } from "@/utils";
import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
interface ChatBottombarProps {
	sendMessage: (newMessage: any) => void;
	isMobile: boolean;
}
⋮----
const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
const handleThumbsUp = () =>
const handleSend = () =>
const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) =>
````

## File: src/features/ai/components/chat-interface/chat-layout.tsx
````typescript
import React, { useEffect, useState } from 'react'
import { cn } from '@/utils'
import { Chat } from './chat'
import { ChatSidebar } from '@/features/ai'
interface ChatLayoutProps {
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
}
export function ChatLayout( {
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
}: ChatLayoutProps )
⋮----
const checkScreenWidth = () =>
````

## File: src/features/ai/components/chat-interface/chat-list.tsx
````typescript
import { cn } from '@/utils'
import React, { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChatBottombar } from '@/features/ai'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
interface ChatListProps {
  messages?: any[]
  selectedUser: any
  sendMessage: ( newMessage: any ) => void
  isMobile: boolean
}
````

## File: src/features/ai/components/chat-interface/chat-sidebar.tsx
````typescript
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip/tooltip'
import { cn } from '@/utils'
import type { Message } from 'ai'
import { MoreHorizontal, SquarePen } from 'lucide-react'
interface SidebarProps {
  isCollapsed: boolean
  links: {
    name: string
    messages: Message[]
    avatar: string
    variant: 'grey' | 'ghost'
  }[]
  onClick?: () => void
  isMobile: boolean
}
⋮----
className=
````

## File: src/features/ai/components/chat-interface/chat-textarea.tsx
````typescript
import { cn } from '@/utils'
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }
⋮----
className=
````

## File: src/features/ai/components/chat-interface/chat-topbar.tsx
````typescript
import React from 'react'
import { Info, Phone, Video } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/utils'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button, buttonVariants } from '@/components/ui/button'
interface ChatTopbarProps {
  selectedUser: any
}
````

## File: src/features/ai/components/chat-interface/chat.tsx
````typescript
import { ChatTopbar } from '@/features/ai/components/chat-interface/chat-topbar'
import { ChatList } from './chat-list'
import React from 'react'
interface ChatProps {
  messages?: any[]
  selectedUser: any
  isMobile: boolean
}
export function Chat(
⋮----
const sendMessage = ( newMessage: any ) =>
````

## File: src/features/ai/components/chat-interface/conversation.tsx
````typescript
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
⋮----
export function Conversation()
⋮----
const handleSubmit = ( e:
````

## File: src/features/ai/components/chat-interface/index.tsx
````typescript

````

## File: src/features/ai/components/mindmap-search-ui/entity-quick-menu.tsx
````typescript
import { AnimatePresence, type HTMLMotionProps, motion } from 'framer-motion'
import { PlusIcon, SquareIcon } from 'lucide-react'
import { type HTMLAttributes, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/utils'
⋮----
const handleOpenSettings = () =>
````

## File: src/features/ai/components/prompt-kit/ai-markdown-message/code-block.tsx
````typescript
import { cn } from "@/utils"
import React, { useEffect, useState } from "react"
import { codeToHtml } from "shiki"
export type CodeBlockProps = {
  children?: React.ReactNode
  className?: string
} & React.HTMLProps<HTMLDivElement>
function CodeBlock(
⋮----
className=
⋮----
export type CodeBlockCodeProps = {
  code: string
  language?: string
  theme?: string
  className?: string
} & React.HTMLProps<HTMLDivElement>
function CodeBlockCode({
  code,
  language = "tsx",
  theme = "github-light",
  className,
  ...props
}: CodeBlockCodeProps)
⋮----
async function highlight()
⋮----
export type CodeBlockGroupProps = React.HTMLAttributes<HTMLDivElement>
function CodeBlockGroup({
  children,
  className,
  ...props
}: CodeBlockGroupProps)
````

## File: src/features/ai/components/prompt-kit/ai-markdown-message/highlighter.tsx
````typescript
import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";
import type { RoughAnnotation } from "rough-notation/lib/model";
import type React from "react";
interface HighlighterProps {
  children: React.ReactNode;
  action?: "highlight" | "circle";
  color?: string;
}
export default function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
}: HighlighterProps)
````

## File: src/features/ai/components/prompt-kit/ai-markdown-message/message.tsx
````typescript
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip'
import {cn} from '@/utils'
import {Markdown} from '../markdown'
export type MessageProps = {
  children: React.ReactNode
  className?: string
} & React.HTMLProps<HTMLDivElement>
const Message = (
export type MessageAvatarProps = {
  src: string
  alt: string
  fallback?: string
  delayMs?: number
  className?: string
}
const MessageAvatar = (
export type MessageContentProps = {
  children: React.ReactNode
  markdown?: boolean
  className?: string
} & React.ComponentProps<typeof Markdown> &
  React.HTMLProps<HTMLDivElement>
const MessageContent = (
export type MessageActionsProps = {
  children: React.ReactNode
  className?: string
} & React.HTMLProps<HTMLDivElement>
const MessageActions = (
⋮----
className=
⋮----
export type MessageActionProps = {
  className?: string
  tooltip: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
} & React.ComponentProps<typeof Tooltip>
const MessageAction = ({
  tooltip,
  children,
  className,
  side = 'top',
  ...props
}: MessageActionProps) =>
````

## File: src/features/ai/components/prompt-kit/ai-markdown-message/model-selector.tsx
````typescript
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { SelectProps } from "@radix-ui/react-select";
import type { ElementType, SVGProps } from "react";
⋮----
export type Model = (typeof MODELS)[number];
interface ModelSelectorProps extends SelectProps {
	value: Model;
	onChange: (value: Model) => void;
	disabledModels?: Model[];
}
export function ModelSelector({
	value,
	onChange,
	disabledModels,
	...props
}: ModelSelectorProps)
⋮----
disabled=
````

## File: src/features/ai/components/prompt-kit/reasoning.tsx
````typescript
import {cn} from '@/utils'
import {ChevronDownIcon} from 'lucide-react'
import type React from 'react'
import {createContext, useContext, useEffect, useRef, useState} from 'react'
import {Markdown} from '../../../../components/ui/markdown'
import {useTextStream, type Mode} from './response-stream'
type ReasoningContextType = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}
⋮----
function useReasoningContext()
export type ReasoningProps = {
  children: React.ReactNode
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}
function Reasoning(
⋮----
const handleOpenChange = (newOpen: boolean) =>
⋮----
export type ReasoningTriggerProps = {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLButtonElement>
⋮----
className=
````

## File: src/features/ai/components/prompt-kit/response-stream.tsx
````typescript
import { cn } from "@/utils"
import React, { useCallback, useEffect, useRef, useState } from "react"
export type Mode = "typewriter" | "fade"
export type UseTextStreamOptions = {
  textStream: string | AsyncIterable<string>
  speed?: number
  mode?: Mode
  onComplete?: () => void
  fadeDuration?: number
  segmentDelay?: number
  characterChunkSize?: number
  onError?: (error: unknown) => void
}
export type UseTextStreamResult = {
  displayedText: string
  isComplete: boolean
  segments: { text: string; index: number }[]
  getFadeDuration: () => number
  getSegmentDelay: () => number
  reset: () => void
  startStreaming: () => void
  pause: () => void
  resume: () => void
}
function useTextStream({
  textStream,
  speed = 20,
  mode = "typewriter",
  onComplete,
  fadeDuration,
  segmentDelay,
  characterChunkSize,
  onError,
}: UseTextStreamOptions): UseTextStreamResult
⋮----
const streamContent = (timestamp: number) =>
⋮----
export type ResponseStreamProps = {
  textStream: string | AsyncIterable<string>
  mode?: Mode
  speed?: number
  className?: string
  onComplete?: () => void
  as?: keyof React.JSX.IntrinsicElements
  fadeDuration?: number
  segmentDelay?: number
  characterChunkSize?: number
}
⋮----
className=
⋮----
return <Container className=
````

## File: src/features/ai/components/prompts/Answer.tsx
````typescript
import Image from 'next/image'
import { Button } from '@/components/ui/button'
export function Answer(
````

## File: src/features/ai/components/prompts/index.tsx
````typescript

````

## File: src/features/ai/components/prompts/PromptInput.tsx
````typescript
import Image from 'next/image'
import { FC } from 'react'
type TInputAreaProps = {
  promptValue: string
  setPromptValue: React.Dispatch<React.SetStateAction<string>>
  handleDisplayResult: () => void
  disabled?: boolean
  reset?: () => void
}
⋮----
onChange=
````

## File: src/features/ai/components/prompts/PromptMessages.tsx
````typescript
import { type StreamableValue } from 'ai/rsc'
interface ChatMessagesProps {
  messages: any
}
type GroupedMessage = {
  id: string
  components: React.ReactNode[]
  isCollapsed?: StreamableValue<boolean> | undefined
}
export function ChatMessages(
````

## File: src/features/ai/components/prompts/PromptPanel.tsx
````typescript
import { useAIState, useActions, useUIState } from "ai/rsc";
import { useRouter } from "next/navigation";
import { type SetStateAction, useEffect, useRef, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import type { AI } from "@/app/actions/assistant/actions";
import { Button } from "@/components/ui/button";
import { usePromptState } from "@/features/ai/components/hooks/usePromptState";
import { UserPromptMessage } from "@/features/ai/components/prompts/UserPromptMessage";
import { Textarea } from "@/features/mindmap/components/note/ui/Textarea";
import { generateId } from "ai";
interface ChatPanelProps {
	messages: any;
	query?: string;
}
⋮----
const isFirstRender = useRef(true); // For development environment
async function handleQuerySubmit(query: string, formData?: FormData)
⋮----
// Add user message to UI state
⋮----
// Submit and get response message
⋮----
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>
⋮----
const handleClear = () =>
⋮----
// focus on input when the page loads
⋮----
// If there are messages and the new button has not been pressed, display the new Button
⋮----
onChange={(e: {
							target: { value: any[] | SetStateAction<string> };
}) =>
setInput(e.target.value);
setShowEmptyScreen(e.target.value.length === 0);
⋮----
e.preventDefault();
⋮----
textarea.form?.requestSubmit();
````

## File: src/features/ai/components/prompts/PromptState.tsx
````typescript
import { createContext, ReactNode, useContext, useState } from 'react'
⋮----
export const AppStateProvider = (
export const usePromptState = () =>
````

## File: src/features/ai/components/prompts/PromptUI.tsx
````typescript
import Image from 'next/image'
⋮----
import { Answer } from '@/features/ai/components/prompts/Answer'
import SimilarTopics from '@/features/ai/components/prompts/SimilarTopics'
import { Sources } from '@/features/ai/components/prompts/Sources'
import { PromptInput } from '@/features/ai/components/prompts/PromptInput'
import { usePromptState } from '@/features/ai/components/prompts/PromptState'
interface PromptUIProps { }
````

## File: src/features/ai/components/prompts/SimilarTopics.tsx
````typescript
import Image from "next/image";
````

## File: src/features/ai/components/prompts/SourceCard.tsx
````typescript
import Image from "next/image";
const SourceCard = (
⋮----
src={`https://www.google.com/s2/favicons?domain=${source.url}&sz=128`}
````

## File: src/features/ai/components/prompts/Sources.tsx
````typescript
import Image from "next/image";
import SourceCard from "./SourceCard";
````

## File: src/features/ai/components/prompts/UserPromptMessage.tsx
````typescript
import React from 'react'
type UserPromptMessageProps = {
  message: string
  chatId?: string
  showShare?: boolean
}
export const UserPromptMessage: React.FC<UserPromptessageProps> = ({
  message,
  chatId,
  showShare = false,
}) =>
````

## File: src/features/ai/components/ai-assisted-search-interface.tsx
````typescript
import { Button } from "@/components/ui/button/button";
import {
	Dialog,
	DialogContent,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { MemoizedMarkdown } from "@/features/ai/components/markdown";
import { cn } from "@/utils";
⋮----
import { type Message, useAssistant } from "ai/react";
import { AnimatePresence, motion } from "framer-motion";
import { SearchIcon } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";
import { Answer } from "./prompts/Answer";
⋮----
className=
⋮----
const handleKeyDown = (event: KeyboardEvent) =>
````

## File: src/features/ai/components/entity-menu.tsx
````typescript
import {
  Apple,
  ArrowRight,
  CheckSquare,
  Grid,
  Info,
  MessageSquare,
  Skull,
  X,
} from 'lucide-react'
import React, { useState } from 'react'
````

## File: src/features/ai/components/index.ts
````typescript

````

## File: src/features/ai/components/knowledge-graph.tsx
````typescript
import React, { useRef, useEffect, useState } from 'react'
import { Maximize2, Minimize2, Camera } from 'lucide-react'
import { useScreenshotCapture } from '@/hooks/use-screenshot-capture'
⋮----
export default function MindMap(
⋮----
const updateMarkmap = async () =>
⋮----
const handleFullscreenChange = () =>
⋮----
const toggleFullscreen = () =>
````

## File: src/features/ai/components/markdown.tsx
````typescript
import { FC, memo } from 'react'
import ReactMarkdown, { Options } from 'react-markdown'
````

## File: src/features/ai/components/message.tsx
````typescript
import {type StreamableValue, useStreamableValue} from 'ai/rsc'
export function Message(
````

## File: src/features/ai/components/SuggestedSearchItem.tsx
````typescript
export const SuggestedSearchItem = (
⋮----
const handleClick = () =>
````

## File: src/features/ai/ai.ts
````typescript
import { createAI } from 'ai/rsc'
import { submitMessage } from './api/actions'
````

## File: src/features/case-files/canvas/canvas-annotations/canvas-annotations.tsx
````typescript
import { cn } from "@/lib/utils";
import type React from "react";
export interface CanvasAnnotationsProps
	extends React.HTMLAttributes<HTMLDivElement> {
	annotations?: Array<{
		id: string;
		x: number;
		y: number;
		content: React.ReactNode;
	}>;
	onAnnotationClick?: (id: string) => void;
}
````

## File: src/features/case-files/canvas/canvas-annotations/index.tsx
````typescript

````

## File: src/features/case-files/canvas/canvas-drawer/canvas-drawer.tsx
````typescript
import { cn } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
⋮----
export interface CanvasDrawerProps {
	children: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	side?: "left" | "right";
	className?: string;
	showHandle?: boolean;
}
⋮----
const handleToggle = () =>
````

## File: src/features/case-files/canvas/canvas-drawer/index.tsx
````typescript

````

## File: src/features/case-files/canvas/canvas-grid/canvas-grid.tsx
````typescript
import { cn } from "@/utils";
import { motion } from "framer-motion";
import type React from "react";
interface CanvasGridItem {
	id: string;
	content: React.ReactNode;
	width?: number;
	height?: number;
}
interface CanvasGridProps {
	items: CanvasGridItem[];
	className?: string;
	columns?: number;
	gap?: number;
}
````

## File: src/features/case-files/canvas/canvas-grid/index.tsx
````typescript

````

## File: src/features/case-files/canvas/demos.tsx
````typescript
import { CanvasAnnotations } from "./canvas-annotations";
export function CanvasAnnotationsDemo()
⋮----
onAnnotationClick=
````

## File: src/features/case-files/canvas/index.tsx
````typescript

````

## File: src/features/case-files/case-file/case-file-evidence/animated-folder.tsx
````typescript
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Folder, FolderOpen, FileText } from "lucide-react"
interface FileItem {
  id: string
  name: string
  type: "file" | "image"
  size?: string
}
interface FolderItem {
  id: string
  name: string
  files: FileItem[]
  isSecret?: boolean
}
interface AnimatedFolderProps {
  folder: FolderItem
  onFileSelect?: (file: FileItem) => void
}
⋮----
const toggleFolder = () =>
````

## File: src/features/case-files/case-file/case-file-evidence/case-file-dossier.tsx
````typescript
import ClassificationBanner from "./classification-banner";
import EvidenceBrowser from "./evidence-browser";
import EvidenceCard from "./evidence-card";
````

## File: src/features/case-files/case-file/case-file-evidence/classification-banner.tsx
````typescript
import { motion } from "framer-motion"
interface ClassificationBannerProps {
  level?: "top-secret" | "classified" | "confidential"
  warning?: string
}
export default function ClassificationBanner({
  level = "top-secret",
  warning = "AUTHORIZED PERSONNEL ONLY",
}: ClassificationBannerProps)
````

## File: src/features/case-files/case-file/case-file-evidence/data-grid.tsx
````typescript
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { useState } from "react"
import EvidenceDetailSidebar from "./evidence-detail-sidebar"
import { ExclamationTriangleIcon, ArrowRightIcon } from "@radix-ui/react-icons"
interface DataEntry {
  id: string
  type: string
  status: "active" | "archived" | "pending"
  date: string
  details: string
  metadata?: {
    createdBy: string
    lastModified: string
    fileSize: string
    format: string
  }
}
interface DataGridProps {
  entries?: DataEntry[]
}
````

## File: src/features/case-files/case-file/case-file-evidence/evidence-browser.tsx
````typescript
import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Database } from "lucide-react"
import AnimatedFolder from "./animated-folder"
import EvidenceDetailSidebar from "./evidence-detail-sidebar"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
interface FileItem {
  id: string
  name: string
  type: "file" | "image"
  size?: string
}
interface FolderItem {
  id: string
  name: string
  files: FileItem[]
  isSecret?: boolean
}
interface EvidenceBrowserProps {
  folders?: FolderItem[]
}
⋮----
const handleFileSelect = (file: FileItem) =>
````

## File: src/features/case-files/case-file/case-file-evidence/evidence-card.tsx
````typescript
import { motion, useAnimation } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Folder } from "lucide-react";
import { useEffect } from "react";
function ProcessingIndicator(
````

## File: src/features/case-files/case-file/case-file-evidence/evidence-detail-sidebar.tsx
````typescript
import { motion } from "framer-motion"
import { FileText, Link, Clock, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Cross2Icon, ExclamationTriangleIcon } from "@radix-ui/react-icons"
interface EvidenceDetail {
  id: string
  type: string
  status: "active" | "archived" | "pending"
  date: string
  details: string
  metadata?: {
    createdBy: string
    lastModified: string
    fileSize: string
    format: string
  }
}
interface EvidenceDetailSidebarProps {
  evidence: EvidenceDetail | null
  onClose: () => void
}
````

## File: src/features/case-files/case-file/case-file-evidence/evidence.mdx
````
import { Meta, Story, Canvas } from '@storybook/blocks'
import * as EvidenceStories from './evidence.stories'

<Meta title="Features/Case Files/Evidence/Documentation" />

# Evidence System Components

The evidence system consists of several interconnected components that work together to provide a comprehensive interface for managing and viewing case evidence.

## Overview

The evidence system includes:
- Evidence Cards for displaying individual pieces of evidence
- Evidence Browser for navigating the evidence database
- Evidence Detail Sidebar for in-depth evidence examination

## Components

### Evidence Card

The Evidence Card component displays key information about a piece of evidence including:
- Classification level (top-secret, classified, confidential)
- Credibility score
- Source verification status
- Timestamp
- Description

```tsx
<EvidenceCard
  caseNumber="X-37B"
  classification="top-secret"
  timestamp="2077-03-15T21:27:18"
  title="Quantum Encryption Breach"
  description="Unauthorized access detected in quantum mainframe sector 7."
  credibilityScore={0.87}
  sourceVerified={true}
/>
```

### Evidence Browser

The Evidence Browser provides a hierarchical view of evidence files organized into folders. Features include:
- Searchable interface
- Classified folder indicators
- File metadata display
- Interactive folder navigation

### Evidence Detail Sidebar

The Detail Sidebar shows comprehensive information about selected evidence:
- Full metadata
- Analysis graphs
- Status indicators
- Processing state

## Usage Examples

### Basic Evidence Card

<Canvas of={EvidenceStories.SingleEvidenceCard} />

### Multiple Classification Levels

<Canvas of={EvidenceStories.EvidenceCardVariants} />

### Complete Interface

<Canvas of={EvidenceStories.FullInterface} />

## Implementation Notes

### Animations and Transitions
- Uses Framer Motion for smooth animations
- Implements staggered animations for folder contents
- Provides visual feedback for user interactions

### Styling
- Consistent dark theme with sci-fi aesthetic
- Uses backdrop blur for depth
- Implements grid patterns and border effects
- Responsive layout adaptations

### State Management
- Local state for folder open/close
- Centralized evidence selection
- Real-time verification status updates

### Accessibility
- Keyboard navigation support
- Screen reader friendly structure
- High contrast text and indicators

## Best Practices

1. **Classification Handling**
   - Always display classification level prominently
   - Use appropriate color coding for different levels
   - Include visual indicators for classified content

2. **Performance**
   - Implement virtualization for large file lists
   - Lazy load evidence details
   - Cache frequently accessed metadata

3. **User Experience**
   - Provide immediate feedback for user actions
   - Maintain consistent animation timings
   - Include loading states for async operations

4. **Security**
   - Respect classification levels in UI
   - Implement proper access controls
   - Log all evidence access attempts

## Component Integration

The evidence system components are designed to work together seamlessly:

```tsx
<div className="grid grid-cols-[1fr_auto]">
  <div>
    <EvidenceBrowser />
    <div className="grid grid-cols-2">
      <EvidenceCard {...evidence1} />
      <EvidenceCard {...evidence2} />
    </div>
  </div>
  <EvidenceDetailSidebar evidence={selectedEvidence} />
</div>
```

## Future Enhancements

- Real-time collaboration features
- Advanced search capabilities
- Evidence relationship visualization
- Timeline view integration
- Enhanced analysis tools
````

## File: src/features/case-files/case-file/case-file-evidence/evidence.stories.tsx
````typescript
import type { Meta, StoryObj } from '@storybook/react'
import { EvidenceCard } from './evidence-card'
import { EvidenceBrowser } from './evidence-browser'
import EvidenceDetailSidebar from './evidence-detail-sidebar'
````

## File: src/features/case-files/case-file/case-file-evidence/index.tsx
````typescript

````

## File: src/features/case-files/case-file/case-file-folder/case-file.tsx
````typescript
import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {GooeySvgFilter} from '@/features/case-files/case-file/case-file-folder/gooey-svg-filter'
import {useScreenSize} from '@/hooks'
import {useDetectBrowser} from '@/hooks/use-detect-browser'
⋮----
export function CaseFiles(
````

## File: src/features/case-files/case-file/case-file-folder/gooey-svg-filter.tsx
````typescript
export const GooeySvgFilter = ({
	id = "gooey-filter",
	strength = 10,
}: {
	id?: string;
	strength?: number;
}) =>
````

## File: src/features/case-files/connections-ui/ConnectionsUi.stories.tsx
````typescript
import type {Meta, StoryObj} from '@storybook/react'
import {EntityConnectionsFlow} from './EntityConnectionsFlow'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/features/case-files/connections-ui/index.tsx
````typescript

````

## File: src/features/case-files/easel-tabs/EaselTabs.stories.tsx
````typescript
import type {Meta, StoryObj} from '@storybook/react'
import {EaselTabs} from './EaselTabs'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/features/case-files/notations-ui/NotationsUi.tsx
````typescript
export interface NotationsUiProps  {
}
export const NotationsUi: React.FC<NotationsUiProps> = (props: NotationsUiProps) =>
````

## File: src/features/case-files/stacked-cards/exploding-stack.stories.tsx
````typescript
import type {Meta, StoryObj} from '@storybook/react'
import {ExplodingStack} from './exploding-stack'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/features/case-files/stacked-cards/StackedCards.tsx
````typescript
import {useUpdateNodeInternals} from '@xyflow/react'
import {useState, useCallback, memo} from 'react'
interface StackedCardRecord {
  id: string
  name: string
  domain: string
  count: number
  prepaid: number
}
interface StackedCardsProps {
  records?: StackedCardRecord[]
  className?: string
}
⋮----
const handleCardInteraction = (index: number) =>
````

## File: src/features/case-files/flashlight-background.tsx
````typescript

````

## File: src/features/collab/live-users.tsx
````typescript
import { useOthers } from "@liveblocks/react/suspense"
export function LiveUsers()
````

## File: src/features/data-viz/components/globes/codepen-viz/codepen-earth-alt.tsx
````typescript
import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Points, Stars } from '@react-three/drei'
⋮----
const geoToCartesian = (lat: number, lon: number, radius: number) =>
const Particles = (
````

## File: src/features/data-viz/components/globes/codepen-viz/codepen-earth.tsx
````typescript
import chroma from "chroma-js";
import {
	OrbitControls,
	Stars,
	shaderMaterial,
	useTexture,
} from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import type React from "react";
import { useEffect, useRef } from "react";
⋮----
import { TransformControls } from "three-stdlib";
⋮----
function Globe()
function colorFn(x: number)
function Point(
export function calculateRadius(itemCount: number)
export const computeWordRefsWithPosition = (
	positionsByRecordId: any,
	items: any[],
) =>
````

## File: src/features/data-viz/components/globes/globe.tsx
````typescript
import { useState } from 'react'
import EarthGlobe from 'react-globe.gl'
export type ReactGlobePointSchema = {}
export interface GlobeProps {
  locations: any[]
  activeLocation: any
}
⋮----
export const CobeGlobe: React.FC<GlobeProps> = ( {
  locations,
  activeLocation,
}: GlobeProps ) =>
````

## File: src/features/data-viz/components/globes/index.tsx
````typescript

````

## File: src/features/data-viz/components/globes/mapbox-globe.tsx
````typescript
import React, { useState } from 'react'
import ReactMapboxGl from 'react-mapbox-gl'
⋮----
// TilesetId: ellisliam.bmjwaijh
⋮----
const updateActiveMarker = (data: React.SetStateAction<any | null>) =>
const closeActiveMarker = ()
⋮----
// const onStyleLoad = useCallback(async () => {
//   const flyTo: any = {
//     center: [-122.737, 37.696],
//     zoom: [10.85],
//     pitch: [3],
//   }
// }, [toggleInfoGraphics])
⋮----
style={`mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9`}
````

## File: src/features/data-viz/components/world-map/world-map.tsx
````typescript
import DottedMap from "dotted-map"
import { motion } from "motion/react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { useRef } from "react"
interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string }
    end: { lat: number; lng: number; label?: string }
  }>
  lineColor?: string
}
⋮----
const projectPoint = ( lat: number, lng: number ) =>
const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
) =>
⋮----
cx=
cy=
````

## File: src/features/data-viz/sightings/components/sightings-timeseries/SightingsTimeSeries.stories.tsx
````typescript
import type {Meta, StoryObj} from '@storybook/react'
import { gsap } from 'gsap';
import { Draggable } from 'gsap-trial/dist/Draggable';
import { InertiaPlugin } from 'gsap-trial/dist/InertiaPlugin';
⋮----
import {SightingsTimeSeries} from '@/features/data-viz/sightings/components/sightings-timeseries/SightingsTimeSeries'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/features/data-viz/sightings/components/sightings-timeseries/SightingsTimeSeries.tsx
````typescript
import {useRef, useState, useEffect, useCallback, type FC} from 'react'
import gsap from 'gsap'
import {Draggable} from 'gsap-trial/dist/Draggable'
import {InertiaPlugin} from 'gsap-trial/dist/InertiaPlugin'
⋮----
interface Window {
    Pane?: unknown
  }
⋮----
interface PaneChangeEvent<T> {
  value: T
}
interface PaneInputOptions {
  min?: number
  max?: number
  step?: number
  options?: Record<string, string>
}
interface PaneInput<T> {
  on: (event: string, callback: (ev: PaneChangeEvent<T>) => void) => void
}
interface Pane {
  hidden: boolean
  dispose: () => void
  addInput: <T>(
    object: Record<string, unknown>,
    key: string,
    options?: PaneInputOptions
  ) => PaneInput<T>
}
interface DraggableInstance {
  x: number
  kill: () => void
  addEventListener: (event: string, callback: () => void) => void
}
interface TimelineItemProps {
  year: number
  isActive: boolean
  distance: number
  showText: boolean
}
const TimelineItem: FC<TimelineItemProps> = (
interface YearsRange {
  start: number
  end: number
}
interface SightingsTimeSeriesProps {
  years: YearsRange
}
````

## File: src/features/data-viz/sightings/components/deck-gl-overlay.tsx
````typescript
import {useMemo} from 'react'
import {MapboxOverlay} from '@deck.gl/mapbox'
import type {DeckProps} from '../types'
export function DeckGLOverlay(
````

## File: src/features/data-viz/sightings/components/EventsTimeSeries.tsx
````typescript
export const EventsTimeSeries = () =>
⋮----
onClick=
````

## File: src/features/data-viz/sightings/components/hud-sightings-terminal.tsx
````typescript
<div className="terminal-line">&nbsp;&nbsp;&nbsp;&nbsp;this.initialize();</div>
⋮----
<div className="terminal-line">&nbsp;&nbsp;&nbsp;&nbsp;this.loadSystems();</div>
````

## File: src/features/data-viz/sightings/components/MapPopup.tsx
````typescript
import type React from 'react'
import {Popup} from 'react-mapbox-gl'
import {formatDate} from '../utils/map-utils'
import type {FeatureInfo, GeoJSONFeature} from '../types'
⋮----
interface MapPopupProps {
  popupInfo: FeatureInfo
  currentHighlightedEvent?: GeoJSONFeature | null
  onClose: () => void
}
````

## File: src/features/data-viz/sightings/components/sightings-globe-settings.tsx
````typescript
import {useState} from 'react'
export const SightingsFilters = () =>
⋮----
onClick=
⋮----
onChange=
````

## File: src/features/data-viz/sightings/components/VisualizationLayers.tsx
````typescript
import {type ReactNode, useRef} from 'react'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {getZoomConfig} from '../hooks/useTimeSeriesVisualization'
⋮----
interface ClusterData {
  id: string
  count: number
  position: [number, number, number]
  color?: string
}
interface PointsLayerProps {
  points: ValidatedUAPSighting[]
  maxPoints?: number
  onPointHover?: (point: ValidatedUAPSighting | null) => void
}
interface ClusterLayerProps {
  clusters: ClusterData[]
  minClusterSize?: number
  onClusterClick?: (cluster: ClusterData) => void
}
interface SightingPointProps {
  sighting: ValidatedUAPSighting
  position: [number, number, number]
  size?: number
  color?: string
  onHover?: (sighting: ValidatedUAPSighting | null) => void
}
interface ClusterPointProps {
  position: [number, number, number]
  count: number
  color?: string
  size?: number
  onClick?: () => void
}
````

## File: src/features/data-viz/sightings/hooks/use-map-initialization.tsx
````typescript
import {useRef, useState, useEffect} from 'react'
import {loadMapboxTileset} from '../utils/map-utils'
interface UseMapInitializationProps {
  useTileset: boolean
  mapLoaded: boolean
  setMapLoaded: (loaded: boolean) => void
  setPopupInfo: (info: any | null) => void
}
export function useMapInitialization({
  useTileset,
  mapLoaded,
  setMapLoaded,
  setPopupInfo,
}: UseMapInitializationProps)
⋮----
const getMapInstance = () =>
const handleMapLoad = () =>
const checkMapInstance = () =>
````

## File: src/features/data-viz/sightings/hooks/use-visualization-layers.tsx
````typescript
import {useCallback} from 'react'
import {GeoJsonLayer, HexagonLayer, HeatmapLayer, ScatterplotLayer} from 'deck.gl'
import {scaleLog} from 'd3-scale'
import type {GeoJSONFeature, FeatureInfo} from '../types'
import AnimatedArcGroupLayer from '../animated-arc-group-layer'
import {AnimatedArcLayer} from '../animated-arc-layer'
type PopupInfoSetter = (info: FeatureInfo | null) => void
type HoverInfoSetter = (info: (FeatureInfo & {x: number; y: number}) | null) => void
interface UseVisualizationLayersProps {
  filteredSightings: GeoJSON.FeatureCollection | null
  visualizationMode: string
  mapLoaded: boolean
  showMilitaryBases: boolean
  showUFOPosts: boolean
  arcAnimationEnabled: boolean
  militaryBases?: GeoJSON.FeatureCollection | null
  ufoPosts?: GeoJSON.FeatureCollection | null
  setPopupInfo: PopupInfoSetter
  setHoverInfo: HoverInfoSetter
}
export function useVisualizationLayers({
  filteredSightings,
  visualizationMode,
  mapLoaded,
  showMilitaryBases,
  showUFOPosts,
  arcAnimationEnabled,
  militaryBases,
  ufoPosts,
  setPopupInfo,
  setHoverInfo,
}: UseVisualizationLayersProps)
````

## File: src/features/data-viz/sightings/hooks/useTimeSeriesVisualization.tsx
````typescript
import {useState, useRef, useEffect, useCallback} from 'react'
import {xata} from '@/db/xata/client'
⋮----
export function getZoomConfig(cameraDistance: number)
export interface TimeDataPoint {
  date: Date
  count: number
}
type TimeRange = [Date, Date]
export function useTimeSeriesAnimation(timeRange: TimeRange)
⋮----
async function fetchTimeData()
⋮----
const animate = () =>
⋮----
export function usePaginatedSightings(timeRange: TimeRange)
````

## File: src/features/data-viz/sightings/uap-dashboard/graph-paper-background/graph-paper-animation.ts
````typescript
drawPath(ctx: CanvasRenderingContext2D, fn: () => void)
random(min: number, max: number, int?: boolean)
getVectorLength(p1: number[], p2: number[])
easing(t: number, b: number, c: number, d: number, s?: number)
cellEasing(t: number, b: number, c: number, d: number, s?: number)
⋮----
interface TextPixelData {
  x: number
  y: number
  value: number
}
interface AnimNumber {
  p: number
  color: string
  blinks: { at: number; dur: number }[]
  pf: number
  x: number
  y: number
  value: number
}
interface AnimLine {
  p: number
  color: number
  pf: number
  x: number
  y: number
  coord: string
  length: number
  dir: number
  distance: number
}
interface Glitch {
  p: number
  color: string
  blinks: { at: number; dur: number }[]
  pf: number
  x: number
  y: number
  width: number
  height: number
}
interface State {
  area: number
  time: number
  lt: number
  planeProgress: number
  dotsProgress: number
  fadeInProgress: number
  textProgress: number
  stepOffset: number
  textOffset: number
  markupOffset: number
  glitches: Glitch[]
  animLines: AnimLine[]
  animNumbers: AnimNumber[]
  tabIsActive: boolean
  planeIsDrawn: boolean
  mousePower: number
  textPixelData: TextPixelData[]
  text: {
    baseLine?: string
    font?: string
    value?: string
  }
  delta: number
  dlt: number
  needRedraw: boolean
}
export class GraphPaperAnimation
⋮----
constructor(onInitialized?: () => void)
start()
getDimensions()
updatePlane()
canvasInit()
initEvents()
resizeHandler(e?: Event)
initCheckingInterval()
loop()
⋮----
const loop = () =>
⋮----
updateState()
draw()
startGeneratingNumbers()
⋮----
const generateItem = () =>
⋮----
drawNumbersAnimation()
startGeneratingLines()
drawAnimLines()
startGeneratingGlitches()
drawGlitches()
drawMouseMoveInteraction(props:
drawPlaneDotsAnimation(props:
drawPlaneCenterLines(props:
drawYLines(props:
drawYMarkup(props:
drawXLines(props:
drawXMarkup(props:
drawPlane()
drawMarkupYAnimation(props:
drawMarkupXAnimation(props:
cleanup()
````

## File: src/features/data-viz/sightings/uap-dashboard/graph-paper-background/graph-paper-background.tsx
````typescript
import { useEffect, useRef, useState } from "react"
⋮----
import { GraphPaperAnimation } from "./graph-paper-animation"
interface GraphPaperBackgroundProps {
  onReady?: () => void
}
export const GraphPaperBackground = (
⋮----
const updateCanvasDimensions = () =>
````

## File: src/features/data-viz/sightings/uap-dashboard/hooks/use-globe-focus.tsx
````typescript
import type React from "react"
import { useRef, useEffect } from "react"
⋮----
export function useGlobeFocus(
  focusedLocation: { lat: number; lon: number } | null,
  controlsRef: React.RefObject<any>,
  camera: THREE.Camera | undefined,
)
⋮----
const animate = (time: number) =>
````

## File: src/features/data-viz/sightings/uap-dashboard/space-hud/space-hud.tsx
````typescript
import {useEffect, useRef} from 'react'
import {gsap} from 'gsap'
⋮----
const initializeHUD = () =>
const animateWireframe = () =>
⋮----
const handleClick = () =>
````

## File: src/features/data-viz/sightings/uap-dashboard/terminal/terminal.tsx
````typescript
import { useEffect, useRef } from "react"
⋮----
const animateTerminalText = () =>
const setTerminalLineRef = (el: HTMLDivElement | null, index: number) =>
⋮----
ref=
````

## File: src/features/data-viz/sightings/uap-dashboard/alternative-globe.tsx
````typescript
import { useRef, useMemo, Suspense } from "react"
import { Canvas, useFrame, extend, useLoader } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { TextureLoader } from "three/src/loaders/TextureLoader"
````

## File: src/features/data-viz/sightings/uap-dashboard/codepen-globe.tsx
````typescript
import { useRef, useMemo, useState, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
````

## File: src/features/data-viz/sightings/uap-dashboard/filter-panel.tsx
````typescript
import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion, useAnimation } from 'framer-motion'
import { FilterOptions } from '@/hooks/use-sightings-data'
interface FilterPanelProps {
  filters: FilterOptions
  onChange: (filters: FilterOptions) => void
  className?: string
}
⋮----
const handleShapeSelect = (shape: string) =>
const toggleSignificance = () =>
const resetFilters = () =>
````

## File: src/features/data-viz/sightings/uap-dashboard/globe.tsx
````typescript
import {useRef, useMemo, useEffect, useCallback, useState} from 'react'
import {Canvas, useThree, useFrame} from '@react-three/fiber'
import {OrbitControls, Sphere, useTexture, Html} from '@react-three/drei'
import type {OrbitControls as OrbitControlsType} from 'three-stdlib'
⋮----
import {Color} from 'three'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {AdaptiveRenderingLayers} from '../components/VisualizationLayers'
interface GlobePoint {
  id: string
  lat: number
  lon: number
  color?: string
  size?: number
  label?: string
}
interface ClusterData {
  id: string
  count: number
  position: [number, number, number]
  color?: string
}
interface EarthProps {
  focusedLocation: {lat: number; lon: number} | null
  sightings?: ValidatedUAPSighting[]
  children?: React.ReactNode
}
function hasValidCoordinates(sighting: ValidatedUAPSighting | undefined): boolean
⋮----
const animate = (time: number) =>
⋮----
function getClusterColor(count: number): string
````

## File: src/features/data-viz/sightings/uap-dashboard/grid-background.tsx
````typescript
export function GridBackground()
````

## File: src/features/data-viz/sightings/uap-dashboard/grid-overlay.tsx
````typescript
export function GridOverlay()
````

## File: src/features/data-viz/sightings/uap-dashboard/HudUapInterface.tsx
````typescript
import React from 'react'
import dynamic from 'next/dynamic'
import {useState, useEffect, useRef} from 'react'
import {Card} from '@/components/ui/card'
import {Skeleton} from '@/components/ui/skeleton'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {TechSection} from './tech-section'
import {GraphPaperBackground} from './graph-paper-background/graph-paper-background'
import {SpaceHud} from './space-hud/space-hud'
import {Terminal} from './terminal/terminal'
import {useSightingsData} from '@/hooks/use-sightings-data'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {FilterPanel} from './filter-panel'
import {TimeRangeSelector} from './time-range-selector'
import {SightingsStatsDisplay} from './sightings-stats-display'
import type {SightingsAnalysisResult} from '@/services/sightings/actions/sightings-ai-analysis'
import Script from 'next/script'
⋮----
interface HudUapInterfaceProps {
  initialSightings: ValidatedUAPSighting[]
  events?: any[]
  analysisResults?: SightingsAnalysisResult
  initialLocations?: any
}
⋮----
// Initialize filters and data
⋮----
// Locations data (either from hook's fetched data or initial props)
⋮----
const renderGlobe = () =>
⋮----
````

## File: src/features/data-viz/sightings/uap-dashboard/pulsing-disk.tsx
````typescript
import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
````

## File: src/features/data-viz/sightings/uap-dashboard/section-header.tsx
````typescript
interface SectionHeaderProps {
  title: string
  subtitle?: string
}
export function SectionHeader(
````

## File: src/features/data-viz/sightings/uap-dashboard/sightings-stats-display.tsx
````typescript
import { motion, useAnimation } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { useMemo, useEffect } from 'react'
interface SightingsStatsDisplayProps {
  stats: any | null
  isLoading: boolean
  className?: string
}
function ProcessingIndicator(
⋮----
// Calculate key metrics
⋮----
// Get total sightings
⋮----
// Extract top shapes (most common)
````

## File: src/features/data-viz/sightings/uap-dashboard/sightings-visualization.tsx
````typescript
import { ValidatedUAPSighting } from '@/lib/schemas/uap-sighting'
import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
interface SightingsVisualizationProps {
  sightings: ValidatedUAPSighting[]
}
export function SightingsVisualization(
````

## File: src/features/data-viz/sightings/uap-dashboard/tech-corners.tsx
````typescript
interface TechCornersProps {
  className?: string
  size?: number
  color?: string
}
⋮----
xmlns="http://www.w3.org/2000/svg"
````

## File: src/features/data-viz/sightings/uap-dashboard/tech-grid-background.tsx
````typescript
export function TechGridBackground()
````

## File: src/features/data-viz/sightings/uap-dashboard/tech-section.tsx
````typescript
import type { ReactNode } from "react"
interface TechSectionProps {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}
````

## File: src/features/data-viz/sightings/uap-dashboard/terminal-display.tsx
````typescript
import { Card } from "@/components/ui/card"
````

## File: src/features/data-viz/sightings/uap-dashboard/time-range-selector.tsx
````typescript
import { useState, useEffect } from 'react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { motion, useAnimation } from 'framer-motion'
import { TimeRange } from '@/hooks/use-sightings-data'
interface TimeRangeSelectorProps {
  timeRange: TimeRange
  onChange: (range: TimeRange) => void
  className?: string
}
⋮----
// Minimum and maximum years for the range
⋮----
// Local state to track slider values before committing
⋮----
// Update local state when props change
⋮----
// Setup animations
⋮----
// Handle slider change
const handleSliderChange = (values: number[]) =>
// Apply the changes
const applyChanges = () =>
// Preset buttons for common time ranges
⋮----
<span>
````

## File: src/features/data-viz/sightings/utils/map-utils.ts
````typescript
import type { MapConfig } from "../types";
export const flyToLocation = (
	longitude: number,
	latitude: number,
	zoom = 5,
	mapConfig: MapConfig,
	setMapConfig: (config: MapConfig) => void,
) =>
export const getUserLocation = (
	mapConfig: MapConfig,
	setMapConfig: (config: MapConfig) => void,
) =>
export const loadMapboxTileset = (
	mapRef: React.RefObject<any>,
	mapLoaded: boolean,
	setPopupInfo: (
		info: {
			coordinates: [number, number];
			properties: Record<string, any>;
		} | null,
	) => void,
) =>
/**
 * Format date for display
 */
export const formatDate = (timestamp: number | string | undefined) =>
````

## File: src/features/data-viz/sightings/utils/sighting-filters.ts
````typescript
import type { GeoJSONFeature, FilterOptions } from "../types";
export const isSignificantEvent = (feature: GeoJSONFeature): boolean =>
export const filterFeature = (
	feature: GeoJSONFeature,
	timeRange: [number, number],
	filters: FilterOptions,
	isSignificantEventFn = isSignificantEvent,
) =>
export const findSignificantEventsInTimeWindow = (
	sightings: GeoJSON.FeatureCollection | null,
	start: number,
	end: number,
	isSignificantEventFn = isSignificantEvent,
): GeoJSONFeature[] =>
````

## File: src/features/data-viz/sightings/animated-arc-group-layer.stories.tsx
````typescript
import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import AnimatedArcGroupLayer, { useAnimatedArcGroupLayer } from './animated-arc-group-layer'
import DeckGL from 'deck.gl'
import { OrthographicView } from '@deck.gl/core'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/features/data-viz/sightings/animated-arc-layer.stories.tsx
````typescript
import React, { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { AnimatedArcLayer } from './animated-arc-layer'
import DeckGL from 'deck.gl'
import { OrthographicView } from '@deck.gl/core'
````

## File: src/features/data-viz/sightings/chatgpt-version.tsx
````typescript

````

## File: src/features/data-viz/sightings/old.tsx
````typescript

````

## File: src/features/data-viz/sightings/README.md
````markdown
# Sightings Globe Component Structure

This directory contains the Sightings Globe visualization component, which displays UFO sightings data on an interactive map. The component has been organized into smaller, reusable pieces to improve maintainability and clarity.

## Component Structure

### Main Components

- `sightings-globe.tsx` - The original monolithic component (kept for reference)
- `sightings-globe-refactored.tsx` - The refactored main component that uses the extracted components

### Extracted Components

- `components/deck-gl-overlay.tsx` - Helper component for attaching deck.gl overlays to a Mapbox map

### Custom Hooks

- `hooks/use-map-initialization.tsx` - Hook for handling map initialization and loading
- `hooks/use-visualization-layers.tsx` - Hook for building deck.gl visualization layers
- `useTimeSeriesAnimation.tsx` - Hook for managing animation of time series data (existing)
- `use-batched-processing.ts` - Hook for efficient batch processing of large datasets (existing)

### Utilities

- `utils/sighting-filters.ts` - Filtering functions for sightings data
- `utils/map-utils.ts` - Utility functions for map operations
- `utils/date-utils.ts` - Date formatting and handling utilities

### Types

- `types.ts` - Shared TypeScript types and interfaces

## Custom Layers

- `animated-arc-layer.tsx` - Custom layer for animated arcs (existing)
- `animated-arc-group-layer.tsx` - Layer for grouping animated arcs (existing)

## How to Use

To use the refactored Sightings Globe component:

```jsx
import { SightingsGlobe } from './sightings-globe-refactored'

// Sample data
const geoJSONSightings = {
  sightings: { /* GeoJSON FeatureCollection */ },
  militaryBases: { /* GeoJSON FeatureCollection */ },
  ufoPosts: { /* GeoJSON FeatureCollection */ }
}

function App() {
  return <SightingsGlobe geoJSONSightings={geoJSONSightings} />
}
```

## Features

- Multiple visualization modes (heatmap, hexagon clusters, scatter plot, arcs, etc.)
- Time-based filtering with animation
- Detailed popups for sighting information
- Filtering by shape, duration, country, and more
- Special highlighting for significant events
- Shows related data layers (military bases, UFO posts)
````

## File: src/features/data-viz/sightings/sightings-loader.tsx
````typescript
import {useRef, useEffect, useState, useCallback} from 'react'
import gsap from 'gsap'
import {useGSAP} from '@gsap/react'
⋮----
interface SightingsLoaderProps {
  onLoadComplete?: () => void
  minDisplayTime?: number
}
export const SightingsLoader = ({
  onLoadComplete,
  minDisplayTime = 9000,
}: SightingsLoaderProps =
⋮----
const handleResourceLoad = () =>
⋮----
const completeLoader = () =>
````

## File: src/features/data-viz/sightings/types.ts
````typescript
export interface DeckProps {
	layers: any[];
	[key: string]: any;
}
export interface SightingsGlobeProps {
	geoJSONSightings: {
		sightings: GeoJSON.FeatureCollection;
		militaryBases?: GeoJSON.FeatureCollection;
		ufoPosts?: GeoJSON.FeatureCollection;
	};
	useExternalData?: boolean;
}
export interface FeatureInfo {
	coordinates: [number, number];
	properties: Record<string, any>;
}
export interface GeoJSONFeature {
	geometry: {
		coordinates: [number, number];
		type: string;
	};
	properties: {
		date?: string | number;
		timestamp?: string | number;
		city?: string;
		location?: string;
		description?: string;
		comments?: string;
		sourceUrl?: string;
		[key: string]: any;
	};
	type: string;
}
export interface MapConfig {
	zoom: [number];
	center: [number, number];
	pitch: [number];
}
export interface FilterOptions {
	shape: string;
	duration: number;
	country: string;
	state: string;
	isSignificantEvent: boolean;
}
````

## File: src/features/data-viz/sightings/use-batched-processing.ts
````typescript
import { useCallback, useEffect, useState } from 'react';
type ProcessCallbackFn<T, R> = (data: T[]) => R[];
export function useBatchedProcessing<T, R>(
  processFn: ProcessCallbackFn<T, R>,
  batchSize = 500
)
⋮----
const processBatch = () =>
⋮----
export function useFilterWithBatching<T>(
  filterFn: (item: T) => boolean,
  batchSize = 500
)
````

## File: src/features/mindmap/actions/actions.ts
````typescript
import { askXataWithAi, tables as xataTables, xata } from "@/db/xata";
import type { z } from "zod";
import { fireCrawl } from "@/lib/firecrawl";
⋮----
type AskParams = {
	question: string;
	prompt?: string;
	table?: string;
};
type SearchParams = {
	query: string;
	id?: string | null;
	table?: string | null;
};
type ExtractParams = {
	prompt: string;
	urls: string[];
	schema?: z.ZodSchema;
	enableWebSearch?: boolean;
};
type DeepResearchParams = {
	query: string;
	maxDepth?: number;
	timeLimit?: number;
	maxUrls?: number;
	enableRealTimeUpdates?: boolean;
};
export const askDatabase = async (
export const searchXataConnections = async ({
	query,
	id = null,
	table = null,
}: SearchParams) =>
export const extract = async ({
	prompt,
	urls,
	schema,
	enableWebSearch = true,
}: ExtractParams) =>
export const deepResearch = async ({
	query,
	maxDepth = 3,
	timeLimit = 180,
	maxUrls = 10,
	enableRealTimeUpdates = true,
}: DeepResearchParams) =>
````

## File: src/features/mindmap/actions/addNextEntitiesToMindMap.ts
````typescript
import { ReactFlowNode, ReactFlowEdge, xataToXYFlow } from './xata-to-xyflow';
import { organizeNodeLayout } from '../layouts/organizeNodeLayout';
export async function addEntitiesWithLayout({
  sourceNode,
  table,
  question,
  reactFlowInstance,
  callbacks
}: {
  sourceNode: ReactFlowNode;
  table: string;
  question: string;
  reactFlowInstance: any;
  callbacks: {
setNodes: (nodes: any)
````

## File: src/features/mindmap/actions/fetch-next-mindmap-records.ts
````typescript
import { xata } from "@/db/xata/client";
⋮----
import { convertDatabaseRecordToMindMapNode } from "@/features/mindmap/utils/conversions";
import type { XataRecord } from "@xata.io/client";
import { q } from "framer-motion/dist/types.d-B50aGbjN";
type FetchNextMindmapRecordsParams = {
	table: string;
	size: number;
	offset: number;
	cursor?: string;
};
export type MindMapNode = {
	id: string;
	data: {
		label: string;
		[key: string]: unknown;
	};
	type: string;
};
export type FetchNextMindmapRecordsResult = {
	nodes: MindMapNode[];
	meta: {
		cursor?: string;
	};
};
export async function fetchNextMindmapRecords(
	params: FetchNextMindmapRecordsParams,
): Promise<FetchNextMindmapRecordsResult>
⋮----
type XataResponse = {
			records: Array<{
				id: string;
				[key: string]: any;
				xata: {
					version: number;
					createdAt: string;
					updatedAt: string;
				};
			}>;
			meta: {
				page?: {
					cursor: string;
					more: boolean;
				};
			};
		};
````

## File: src/features/mindmap/actions/get-entity-network-graph-data.ts
````typescript
import {
	getAllArtifacts,
	getAllDocuments,
	getAllEvents,
	getAllEventsExpertsConnections,
	getAllEventsTopicsExpertsConnections,
	getAllOrganizations,
	getAllOrganizationsMembers,
	getAllPersonnel,
	getAllTestimonies,
	getAllTopics,
	getAllTopicsExpertsConnections,
	getAllTopicsTestimoniesConnections,
} from "@/db/xata/db/models";
const formatGraphNode = (
const formatGraphEdge = (
export type NetworkGraphPayload = {
	records: {
		topics: Record<string, any>[];
		events: Record<string, any>[];
		personnel: Record<string, any>[];
		testimonies: Record<string, any>[];
		organizations: Record<string, any>[];
	};
	connections: {
		topicsExpertsConnections: Record<string, any>[];
		eventsExpertsConnections: Record<string, any>[];
		eventsTopicsExpertsConnections: Record<string, any>[];
		topicsTestimoniesConnections: Record<string, any>[];
		organizationsPersonnelConnections: Record<string, any>[];
	};
	graphData: {
		nodes: any[];
		links: any[];
	};
};
export const getEntityNetworkGraphData = async () =>
````

## File: src/features/mindmap/actions/search.ts
````typescript
import type { SearchResult } from '@/app/api/disclosure/data-layer/search/table/route'
import axios from 'axios'
export const initiateDatabaseWideConnectionSearch = async (
export const initiateRagEnrichedDatabaseSearch = async (
export const initiateDatabaseTableQuery = async ( {
  keyword,
  table,
}: {
  keyword: string
  table: string
} ): Promise<SearchResult | undefined> =>
````

## File: src/features/mindmap/components/cards/card-stack/animated-mini-card.tsx
````typescript
import { motion } from 'framer-motion'
````

## File: src/features/mindmap/components/cards/card-stack/card-stack-multiview.tsx
````typescript
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import { Minimize2, Maximize2, Layers, Layers3 } from 'lucide-react'
````

## File: src/features/mindmap/components/cards/card-stack/card-stack.tsx
````typescript
import { CardStackUI } from '@/features/mindmap/components/cards/card-stack/cards'
export const formatNodesForCardDisplay = ( nodes: any ) =>
export const CardStack = ( {
  mindmapCards,
  stacked,
  toggleStack,
  removeChildCardClone,
}: {
  mindmapCards: any
  stacked: any
  toggleStack: any
  removeChildCardClone: any
} ) =>
````

## File: src/features/mindmap/components/cards/card-stack/cards.tsx
````typescript
import { AnimatedMiniCard } from '@/features/mindmap/components/cards/card-stack/animated-mini-card'
import { GraphCard } from '@/features/mindmap/components/cards/graph-card'
import { MiniCard } from '@/features/mindmap/components/cards/mini-card'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import React, { useCallback, useState } from 'react'
interface CardRotateProps {
  children: React.ReactNode
  cardId: any
  onSendToBack: ( id: any ) => void
}
⋮----
const sendToBack = ( id: number ) =>
````

## File: src/features/mindmap/components/cards/connection-card/connection-card.tsx
````typescript
import React from 'react'
export interface ConnectionCardProps { }
export const ConnectionCard: React.FC<ConnectionCardProps> = (
  props: ConnectionCardProps
) =>
````

## File: src/features/mindmap/components/cards/connection-card/index.tsx
````typescript

````

## File: src/features/mindmap/components/cards/entity-card/entity-card-tooltip.tsx
````typescript
import { AnimatedImageContent } from '@/features/mindmap/components/cards/entity-card/entity-card'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
````

## File: src/features/mindmap/components/cards/entity-card/entity-card-utility-menu.tsx
````typescript
import { memo, type FunctionComponent } from 'react'
import { ConnectionsIcon } from '@/components/icons'
import { Button } from '@/components/ui/button/button'
import { Separator } from '@/components/ui/separator'
interface EntityCardUtilityMenuProps {
  updateNote: any
  bookmarked: boolean
  saveNote: any
  userNote: any
  findConnections?: any
}
export const EM: FunctionComponent<EntityCardUtilityMenuProps> = ( {
  updateNote,
  userNote,
  saveNote,
  findConnections,
} ) =>
````

## File: src/features/mindmap/components/cards/entity-card/entity-card.tsx
````typescript
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
⋮----
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { forwardRef, useCallback, useEffect, useState } from 'react'
import { ConnectionList } from '@/features/mindmap/components/connection-list'
import { useEntity } from '@/hooks'
import { truncate } from '@/utils/functions'
import type { ImageProps } from '@/utils/image.utils'
import { format } from 'date-fns'
⋮----
export interface MindMapEntityCardProps {
  id: string
  data: {
    date: any
    description: string
    latitude: number
    location: string
    longitude: number
    photos: ImageProps[]
    name: string
    color: string
    type: string
    label: string
    fill: string
  }
}
⋮----
const x = useMotionValue( 0 ) // going to set this value on mouse move
// rotate the tooltip
⋮----
// translate the tooltip
⋮----
// const cardRef = useRef()
// onMouseMove={handleMouseMove}
// onMouseEnter={handleMouseEnter}
// onMouseLeave={handleMouseLeave}
⋮----
const truncateText = ( text: string, maxLength: number ): string =>
````

## File: src/features/mindmap/components/cards/entity-card/index.tsx
````typescript

````

## File: src/features/mindmap/components/cards/entity-group-card/entity-group-card-bg.tsx
````typescript
import { cn } from '@/utils'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
⋮----
const getUniforms = () =>
````

## File: src/features/mindmap/components/cards/entity-group-card/entity-group-card.tsx
````typescript
import { SketchyGlobe } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useMindMap } from "@/contexts";
import { formatNodesForCardDisplay } from "@/features/mindmap/components/cards/card-stack/card-stack";
import {
	CardBottom,
	CardCorners,
	CardTop,
} from "@/features/mindmap/components/cards/entity-group-card/sections";
import { GROUP_NODE_DIMENSIONS } from "@/features/mindmap/config/nodes.config";
import { extractUniqueYearsFromEvents } from "@/utils";
import { LayersIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useMeasure } from "react-use";
interface GridPatternProps {
	width?: any;
	height?: any;
	x?: any;
	y?: any;
	squares?: Array<[x: number, y: number]>;
	strokeDasharray?: any;
	className?: string;
	[key: string]: any;
}
interface EntityGroupCardProps {
	card: any;
}
⋮----
const toggleStack = ()
⋮----
const removeChildCardClone = (cardId: any) =>
````

## File: src/features/mindmap/components/cards/entity-group-card/lights-background.tsx
````typescript
import { cn } from '@/utils'
export const LightsBackground: React.FC<
````

## File: src/features/mindmap/components/cards/entity-group-card/sections.tsx
````typescript
import { DOMAIN_MODEL_COLORS } from "@/utils"
````

## File: src/features/mindmap/components/cards/entity-group-card/topic-group-card.tsx
````typescript
import { formatNodesForCardDisplay } from '@/features/mindmap/components/cards/card-stack/card-stack'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMindMap } from '@/contexts'
import { truncate } from '@/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronsRight, X } from 'lucide-react'
import { Gallery } from '@/components/animated/gallery'
import { Button } from '@/components/ui/button'
import { ConnectionsIcon, TopicsIcon } from '@/components/icons'
import { AddNote } from '@/components/note/AddNote'
import { Separator } from '@/components/ui/separator'
import { useEntity } from '@/hooks/useEntity'
import { format } from 'date-fns'
import Link from 'next/link'
import { useMediaQuery, useOnClickOutside } from 'usehooks-ts'
⋮----
const removeChildCardClone = ( cardId: any ) =>
⋮----
function onKeyDown( event: KeyboardEvent )
````

## File: src/features/mindmap/components/cards/event/bonsai-card.tsx
````typescript
import { EventsIcon } from "@/components/icons/entity-icons"
import { useEntity } from "@/hooks"
import { STOCK_PHOTOS } from "@/utils"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { useState } from "react"
interface BonsaiCardProps {
  card: any
}
````

## File: src/features/mindmap/components/cards/event/grid-card.tsx
````typescript
import { useEntity } from "@/hooks"
import { STOCK_PHOTOS } from "@/utils"
import { format } from "date-fns"
import { project } from "deck.gl"
import { ArrowUpRight } from "lucide-react"
import { useState } from "react"
export function GridCard(
⋮----
onMouseLeave=
````

## File: src/features/mindmap/components/cards/event/photo-carousel.tsx
````typescript
import React, { useState, useEffect, RefObject, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
interface PhotoCarouselProps {
  images: string[]
}
⋮----
const handlePrev = () =>
const handleNext = () =>
⋮----
const handleMouseMove = ( e: MouseEvent ) =>
const handleClick = ( e: MouseEvent ) =>
````

## File: src/features/mindmap/components/cards/graph-card/graph-card-bg.tsx
````typescript
import { motion } from 'framer-motion'
import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/utils'
interface GridPatternProps {
  width?: number
  height?: number
  x?: number
  y?: number
  strokeDasharray?: any
  numSquares?: number
  className?: string
  maxOpacity?: number
  duration?: number
  repeatDelay?: number
}
⋮----
function getPos()
function generateSquares( count: number )
const updateSquarePosition = ( id: number ) =>
⋮----
className=
````

## File: src/features/mindmap/components/cards/graph-card/graph-card.tsx
````typescript
import { EntityCardUtilityMenu } from "@/features/mindmap/components/cards/entity-card";
import { DOMAIN_MODEL_COLORS, STOCK_PHOTOS, truncate } from "@/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { useEntity } from "@/hooks";
import { format } from "date-fns";
⋮----
// const [animatedTitle, setAnimatedTitle] = useState<string>('')
// const [animatedDate, setAnimatedDate] = useState<string>('')
// const [titleFinished, setTitleFinished] = useState(false)
// const [t, setT] = useState<number>(0)
// const [i, setI] = useState<number>(0)
// useEffect(() => {
//   const typingEffect = setInterval(() => {
//     if (t < name.length) {
//       setAnimatedTitle(name.substring(0, t + 1))
//       setT(t + 1)
//     } else {
//       clearInterval(typingEffect)
//       setTitleFinished(true)
//     }
//   }, 100)
//   return () => {
//     clearInterval(typingEffect)
//   }
// }, [name, t])
// useEffect(() => {
//   const typingEffectTwo = setInterval(() => {
//     if (titleFinished) {
//       if (i < date.length) {
//         setAnimatedDate(date.substring(0, i + 1))
//         setI(i + 1)
//       } else {
//         clearInterval(typingEffectTwo)
//       }
//     }
//   }, 100)
//   return () => {
//     clearInterval(typingEffectTwo)
//   }
// }, [date, date.length, i, name, t, titleFinished])
⋮----
const updateActiveIndex = (index: number) =>
⋮----
{/* <div
        className={`absolute -inset-2 rounded-lg bg-gradient-to-r from-[#78efff] via-[#E393E6] to-[${color}] opacity-50 blur w-full h-full`}
      ></div> */}
````

## File: src/features/mindmap/components/cards/graph-card/index.tsx
````typescript

````

## File: src/features/mindmap/components/cards/root-node-card/index.tsx
````typescript

````

## File: src/features/mindmap/components/cards/root-node-card/RootNodeToolbar.tsx
````typescript
import React, { useRef, useState } from 'react'
import { motion, MotionConfig } from 'framer-motion'
import { ArrowLeft, Search, User } from 'lucide-react'
import { useClickOutside } from '@/hooks/useClickOutside'
⋮----
function Button( {
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  ariaLabel?: string
} )
````

## File: src/features/mindmap/components/cards/root-node-card/search-input-spotlight.tsx
````typescript
import { useRef, useState } from 'react'
export const InputBorderSpotlight = ({
  onChange,
  onSubmit,
  type,
  value,
  className,
}: any) =>
⋮----
const handleMouseMove = (e: React.MouseEvent<HTMLInputElement>) =>
const handleFocus = () =>
const handleBlur = () =>
const handleMouseEnter = () =>
const handleMouseLeave = () =>
````

## File: src/features/mindmap/components/cards/subject-matter-expert-card/index.tsx
````typescript

````

## File: src/features/mindmap/components/cards/subject-matter-expert-card/SubjectMatterExpertCard.tsx
````typescript
import { KeyFiguresIcon } from '@/components/icons'
import { useEntity } from '@/hooks'
import Image from 'next/image'
import { useRef } from 'react'
export function SubjectMatterExpertCard(
````

## File: src/features/mindmap/components/cards/basic-mindmap-cards.tsx
````typescript
import Image from 'next/image'
import { motion } from 'framer-motion'
export const BasicCardThree = () =>
export const BasicCardFour = () =>
export const BasicCardFive = () =>
````

## File: src/features/mindmap/components/cards/index.tsx
````typescript
import { EventGlobeCard } from '@/features/mindmap/components/cards/event/event-globe-card'
````

## File: src/features/mindmap/components/cards/layer-zero-card.tsx
````typescript
interface LazyerZeroCardProps {}
````

## File: src/features/mindmap/components/cards/luxe-card.tsx
````typescript

````

## File: src/features/mindmap/components/cards/mini-card.tsx
````typescript
import { EntityCardUtilityMenu } from '@/features/mindmap/components/cards/entity-card'
import { useEntity } from '@/hooks'
import { STOCK_PHOTOS } from '@/utils'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
````

## File: src/features/mindmap/components/cards/render-entity-card.tsx
````typescript
import { EventCard } from '@/features/mindmap/components/cards'
import { EntityGroupCard } from '@/features/mindmap/components/cards/entity-group-card/entity-group-card'
import { TopicAndTestimoniesGroupCard } from '@/features/mindmap/components/cards/entity-group-card/topic-group-card'
import { GraphCard } from '@/features/mindmap/components/cards/graph-card'
import { TestimonyCard } from '@/features/mindmap/components/cards/testimony-card'
import { SubjectMatterExpertCard } from './subject-matter-expert-card'
⋮----
interface renderEntityProps {
  type: keyof typeof entityMap
  data: any
}
export const renderEntity: React.FC<renderEntityProps> = (
export const renderEntityGroup: React.FC<renderEntityProps> = ( {
  type,
  data,
} ) =>
````

## File: src/features/mindmap/components/cards/testimony-card.tsx
````typescript
import { BlurAppear } from '@/components/animated'
import { formatModelWithImage } from '@/utils/image.utils'
type TestimonyCardProps = {
  card: {
    claim: string
    documentation: any[]
    witness: any
    event: any
    date?: string
    summary: any
    xata: {
      createdAt: string
      updatedAt: string
      version: number
    }
    color: string
    type: string
    fill: string
    parentId: string
  }
}
````

## File: src/features/mindmap/components/cards/topic-card.tsx
````typescript
import { EntityCardUtilityMenu } from '@/features/mindmap/components/cards/entity-card'
import { DOMAIN_MODEL_COLORS, truncate } from '@/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ConnectionList } from '@/features/mindmap/components/connection-list'
import { useEntity } from '@/hooks'
import { image } from 'd3'
import { format } from 'date-fns'
import { Plus, X } from 'lucide-react'
import { useOnClickOutside } from 'usehooks-ts'
⋮----
// const [animatedTitle, setAnimatedTitle] = useState<string>('')
// const [animatedDate, setAnimatedDate] = useState<string>('')
// const [titleFinished, setTitleFinished] = useState(false)
// const [t, setT] = useState<number>(0)
// const [i, setI] = useState<number>(0)
// useEffect(() => {
//   const typingEffect = setInterval(() => {
//     if (t < name.length) {
//       setAnimatedTitle(name.substring(0, t + 1))
//       setT(t + 1)
//     } else {
//       clearInterval(typingEffect)
//       setTitleFinished(true)
//     }
//   }, 100)
//   return () => {
//     clearInterval(typingEffect)
//   }
// }, [name, t])
// useEffect(() => {
//   const typingEffectTwo = setInterval(() => {
//     if (titleFinished) {
//       if (i < date.length) {
//         setAnimatedDate(date.substring(0, i + 1))
//         setI(i + 1)
//       } else {
//         clearInterval(typingEffectTwo)
//       }
//     }
//   }, 100)
//   return () => {
//     clearInterval(typingEffectTwo)
//   }
// }, [date, date.length, i, name, t, titleFinished])
⋮----
const updateActiveIndex = ( index: number ) =>
⋮----
function onKeyDown( event: KeyboardEvent )
````

## File: src/features/mindmap/components/clones/clone-node.tsx
````typescript
import { cn } from '@/utils'
import { motion } from 'framer-motion'
import { forwardRef, type FC } from 'react'
interface CloneChildNodeProps {
  cloneId: string
  className?: string
  children: React.ReactNode
}
````

## File: src/features/mindmap/components/launchpad/launchpad.stories.tsx
````typescript
import type { Meta, StoryObj } from '@storybook/react'
import { LaunchPad } from './launchpad'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/features/mindmap/components/menus/expandable-tab-menu.tsx
````typescript
import { AnimatePresence, motion } from "framer-motion"
import { Bell, HelpCircle, Home, Settings, Shield } from "lucide-react"
import { useRef, useState } from "react"
import { useOnClickOutside } from "usehooks-ts"
````

## File: src/features/mindmap/components/menus/floating-node-menu.tsx
````typescript
import {
  EventsIcon,
  KeyFiguresIcon,
  OrganizationsIcon,
  TestimoniesIcon,
  TopicsIcon,
} from '@/components/icons'
import { useClickOutside } from '@/hooks'
import { useMindMap } from '@/contexts'
import { AnimatePresence, motion } from 'framer-motion'
import { PlusIcon } from 'lucide-react'
import React, { useCallback, useState } from 'react'
````

## File: src/features/mindmap/components/menus/mindmap-ai-chat.tsx
````typescript
import {ExpandableChat} from '@/components/ui/chat/expandable-chat'
import {useAssistant} from '@ai-sdk/react'
import {useState} from 'react'
export const MindMapAiChat = () =>
````

## File: src/features/mindmap/components/menus/mindmap-utility-cursor.tsx
````typescript
import React, { useEffect, useState, useRef } from 'react'
import {
  motion,
  SpringOptions,
  useMotionValue,
  useSpring,
  AnimatePresence,
  Transition,
  Variant,
} from 'framer-motion'
import { cn } from '@/utils'
import { PlusIcon } from 'lucide-react'
type CursorProps = {
  children: React.ReactNode
  className?: string
  springConfig?: SpringOptions
  attachToParent?: boolean
  transition?: Transition
  variants?: {
    initial: Variant
    animate: Variant
    exit: Variant
  }
  onPositionChange?: ( x: number, y: number ) => void
}
function CoreCursor( {
  children,
  className,
  springConfig,
  attachToParent,
  variants,
  transition,
  onPositionChange,
}: CursorProps )
⋮----
const updatePosition = ( e: MouseEvent ) =>
⋮----
const handleVisibilityChange = ( visible: boolean ) =>
⋮----
className=
⋮----
const handlePositionChange = ( x: number, y: number ) =>
````

## File: src/features/mindmap/components/menus/model-action-toolbar.stories.tsx
````typescript
import type { Meta, StoryObj } from '@storybook/react'
import { DynamicToolbar } from './model-action-toolbar'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/features/mindmap/components/menus/model-action-toolbar.tsx
````typescript
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
	ChevronDown,
	ChevronLeft,
	MousePointerClick,
	Plus,
	Search,
	Sparkles,
	SunMoon,
	X,
} from "lucide-react";
import { useState } from "react";
⋮----
const handleButtonClick = (buttonName: string) =>
⋮----
onChange=
````

## File: src/features/mindmap/components/menus/NodeMenu.tsx
````typescript
import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useState } from 'react'
import { context } from 'shadergradient'
````

## File: src/features/mindmap/components/menus/oracle-sphere.stories.tsx
````typescript
import type { Meta, StoryObj } from '@storybook/react'
import { OracleSphere } from './oracle-sphere'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/features/mindmap/components/menus/oracle-sphere.tsx
````typescript
import React, {useRef, useState, useMemo} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'
import {OrbitControls, Sphere, useTexture} from '@react-three/drei'
⋮----
interface OracleSphereProps {
  color?: string
  className?: string
  size?: number
}
interface Particle {
  position: [number, number, number]
  scale: number
  id: string
}
⋮----
const groupRef = useRef<THREE.Group>(null)
⋮----
const particles = useMemo<Particle[]>(() =>
useFrame((state, delta) =>
⋮----
{/* Lighting */}
⋮----
{/* Scene Controls */}
⋮----
{/* Main Content */}
⋮----
{/* Optional UI control for switching modes */}
````

## File: src/features/mindmap/components/note/BlockEditor/components/EditorInfo.tsx
````typescript
import { WebSocketStatus } from '@hocuspocus/provider'
import { memo } from 'react'
import { EditorUser } from '../types'
import { cn } from '../../../lib/utils'
import { getConnectionText } from '../../../lib/utils/getConnectionText'
import Tooltip from '../../ui/Tooltip'
export type EditorInfoProps = {
  characters: number
  words: number
  collabState: WebSocketStatus
  users: EditorUser[]
}
````

## File: src/features/mindmap/components/note/BlockEditor/BlockEditor.tsx
````typescript
import { WebSocketStatus } from '@hocuspocus/provider'
import { EditorContent, PureEditorContent } from '@tiptap/react'
import React, { useMemo, useRef } from 'react'
import { LinkMenu } from '@/components/menus'
import { useBlockEditor } from '@/hooks/useBlockEditor'
⋮----
import { Sidebar } from '@/components/Sidebar'
import { Loader } from '@/components/ui/Loader'
import { EditorContext } from '@/context/EditorContext'
import ImageBlockMenu from '@/extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '@/extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '@/extensions/Table/menus'
import { useAIState } from '@/hooks/useAIState'
import { createPortal } from 'react-dom'
import { TiptapProps } from './types'
import { EditorHeader } from './components/EditorHeader'
import { TextMenu } from '../menus/TextMenu'
import { ContentItemMenu } from '../menus/ContentItemMenu'
export const BlockEditor = (
````

## File: src/features/mindmap/components/note/BlockEditor/index.tsx
````typescript

````

## File: src/features/mindmap/components/note/BlockEditor/types.tsx
````typescript
import { TiptapCollabProvider } from '@hocuspocus/provider'
import { Language } from '@tiptap-pro/extension-ai'
import type { Doc as YDoc } from 'yjs'
export interface TiptapProps {
  aiToken: string
  hasCollab: boolean
  ydoc: YDoc
  provider?: TiptapCollabProvider | null | undefined
}
export type EditorUser = {
  clientId: string
  name: string
  color: string
  initials?: string
}
export type LanguageOption = {
  name: string
  label: string
  value: Language
}
export type AiTone =
  | 'academic'
  | 'business'
  | 'casual'
  | 'childfriendly'
  | 'conversational'
  | 'emotional'
  | 'humorous'
  | 'informative'
  | 'inspirational'
  | string
export type AiPromptType = 'SHORTEN' | 'EXTEND' | 'SIMPLIFY' | 'TONE'
export type AiToneOption = {
  name: string
  label: string
  value: AiTone
}
export type AiImageStyle = {
  name: string
  label: string
  value: string
}
````

## File: src/features/mindmap/components/note/context/EditorContext.ts
````typescript
import { createContext } from 'react'
interface IEditorContext {
  isAiLoading: boolean
  aiError?: string | null
  setIsAiLoading: Function
  setAiError: Function
}
````

## File: src/features/mindmap/components/note/extensions/AiImage/AiImage.tsx
````typescript
import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { v4 as uuid } from 'uuid'
import { AiImageView } from './components/AiImageView'
⋮----
interface Commands<ReturnType> {
    aiImage: {
      setAiImage: () => ReturnType
    }
  }
⋮----
addOptions()
addAttributes()
parseHTML()
renderHTML(
addCommands()
addNodeView()
````

## File: src/features/mindmap/components/note/extensions/AiImage/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/AiWriter/AiWriter.tsx
````typescript
import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { v4 as uuid } from 'uuid'
import { AiWriterView } from './components/AiWriterView'
⋮----
interface Commands<ReturnType> {
    aiWriter: {
      setAiWriter: () => ReturnType
    }
  }
⋮----
addOptions()
addAttributes()
parseHTML()
renderHTML(
addCommands()
addNodeView()
````

## File: src/features/mindmap/components/note/extensions/AiWriter/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/BlockquoteFigure/Quote/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/BlockquoteFigure/Quote/Quote.ts
````typescript
import { Node } from '@tiptap/core'
⋮----
parseHTML()
renderHTML(
addKeyboardShortcuts()
````

## File: src/features/mindmap/components/note/extensions/BlockquoteFigure/QuoteCaption/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/BlockquoteFigure/QuoteCaption/QuoteCaption.ts
````typescript
import { Node } from '@tiptap/core'
⋮----
parseHTML()
renderHTML(
addKeyboardShortcuts()
````

## File: src/features/mindmap/components/note/extensions/BlockquoteFigure/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/Document/Document.ts
````typescript
import { Document as TiptapDocument } from '@tiptap/extension-document'
````

## File: src/features/mindmap/components/note/extensions/Document/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/EmojiSuggestion/components/EmojiList.tsx
````typescript
import { EmojiItem } from '@tiptap-pro/extension-emoji'
import React, { ForwardedRef, forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Panel } from '@/components/ui/Panel'
import { EmojiListProps } from '../types'
import { SuggestionKeyDownProps } from '@tiptap/suggestion'
⋮----
const scrollIntoView = (index: number) =>
const upHandler = () =>
const downHandler = () =>
const enterHandler = () =>
````

## File: src/features/mindmap/components/note/extensions/EmojiSuggestion/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/EmojiSuggestion/suggestion.ts
````typescript
import { ReactRenderer } from '@tiptap/react'
import { Editor } from '@tiptap/core'
import { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'
import tippy, { Instance } from 'tippy.js'
import EmojiList from './components/EmojiList'
import { KeyboardEvent, RefAttributes } from 'react'
import { EmojiListProps } from './types'
⋮----
onUpdate(props: SuggestionProps<any>)
onKeyDown(props: SuggestionKeyDownProps)
onExit()
````

## File: src/features/mindmap/components/note/extensions/EmojiSuggestion/types.ts
````typescript
import { EmojiItem } from '@tiptap-pro/extension-emoji'
export interface Command {
  name: string
}
export interface EmojiListProps {
  command: (command: Command) => void
  items: EmojiItem[]
}
````

## File: src/features/mindmap/components/note/extensions/Figcaption/Figcaption.ts
````typescript
import { mergeAttributes, Node } from '@tiptap/core'
import { Image } from '../Image'
⋮----
addOptions()
⋮----
parseHTML()
addKeyboardShortcuts()
renderHTML(
````

## File: src/features/mindmap/components/note/extensions/Figcaption/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/Figure/Figure.ts
````typescript
import { mergeAttributes, Node } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'
⋮----
addOptions()
⋮----
parseHTML()
renderHTML(
addProseMirrorPlugins()
````

## File: src/features/mindmap/components/note/extensions/Figure/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/FontSize/FontSize.ts
````typescript
import { Attributes, Extension } from '@tiptap/core'
⋮----
interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType
      unsetFontSize: () => ReturnType
    }
  }
⋮----
addOptions()
addGlobalAttributes()
addCommands()
````

## File: src/features/mindmap/components/note/extensions/FontSize/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/Heading/Heading.ts
````typescript
import { mergeAttributes } from '@tiptap/core'
import TiptapHeading from '@tiptap/extension-heading'
import type { Level } from '@tiptap/extension-heading'
⋮----
renderHTML(
````

## File: src/features/mindmap/components/note/extensions/Heading/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/HorizontalRule/HorizontalRule.ts
````typescript
import { mergeAttributes } from '@tiptap/core'
import TiptapHorizontalRule from '@tiptap/extension-horizontal-rule'
⋮----
renderHTML()
````

## File: src/features/mindmap/components/note/extensions/HorizontalRule/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/Image/Image.ts
````typescript
import { Image as BaseImage } from '@tiptap/extension-image'
````

## File: src/features/mindmap/components/note/extensions/Image/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/ImageBlock/components/ImageBlockView.tsx
````typescript
import { cn } from '@/utils'
import { Node } from '@tiptap/pm/model'
import { Editor, NodeViewWrapper } from '@tiptap/react'
import { useCallback, useRef } from 'react'
interface ImageBlockViewProps {
  editor: Editor
  getPos: () => number
  node: Node & {
    attrs: {
      src: string
    }
  }
  updateAttributes: ( attrs: Record<string, string> ) => void
}
export const ImageBlockView = ( props: ImageBlockViewProps ) =>
````

## File: src/features/mindmap/components/note/extensions/ImageBlock/components/ImageBlockWidth.tsx
````typescript
import { memo, useCallback, useEffect, useState } from 'react'
export type ImageBlockWidthProps = {
  onChange: (value: number) => void
  value: number
}
````

## File: src/features/mindmap/components/note/extensions/ImageBlock/ImageBlock.ts
````typescript
import { ReactNodeViewRenderer } from '@tiptap/react'
import { mergeAttributes, Range } from '@tiptap/core'
import { ImageBlockView } from './components/ImageBlockView'
import { Image } from '../Image'
⋮----
interface Commands<ReturnType> {
    imageBlock: {
      setImageBlock: (attributes: { src: string }) => ReturnType
      setImageBlockAt: (attributes: { src: string; pos: number | Range }) => ReturnType
      setImageBlockAlign: (align: 'left' | 'center' | 'right') => ReturnType
      setImageBlockWidth: (width: number) => ReturnType
    }
  }
⋮----
addAttributes()
parseHTML()
renderHTML(
addCommands()
addNodeView()
````

## File: src/features/mindmap/components/note/extensions/ImageBlock/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/ImageUpload/view/hooks.ts
````typescript
import { DragEvent, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { API } from '@/services/api'
export const useUploader = ({
  onUpload,
}: {
  onUpload: (url: string) => void
}) =>
export const useFileUpload = () =>
export const useDropZone = ({
  uploader,
}: {
  uploader: (file: File) => void
}) =>
⋮----
const dragStartHandler = () =>
const dragEndHandler = () =>
⋮----
const onDragEnter = () =>
const onDragLeave = () =>
````

## File: src/features/mindmap/components/note/extensions/ImageUpload/view/ImageUpload.tsx
````typescript
import { Editor, NodeViewWrapper } from '@tiptap/react'
import { useCallback } from 'react'
import { ImageUploader } from './ImageUploader'
export const ImageUpload = (
````

## File: src/features/mindmap/components/note/extensions/ImageUpload/view/ImageUploader.tsx
````typescript
import { Spinner } from '@/components/ui/Spinner'
import { useDropZone, useFileUpload, useUploader } from './hooks'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/utils'
import { ChangeEvent, useCallback } from 'react'
export const ImageUploader = ( {
  onUpload,
}: {
  onUpload: ( url: string ) => void
} ) =>
````

## File: src/features/mindmap/components/note/extensions/ImageUpload/view/index.tsx
````typescript

````

## File: src/features/mindmap/components/note/extensions/ImageUpload/ImageUpload.ts
````typescript
import { Node, ReactNodeViewRenderer } from '@tiptap/react'
import { ImageUpload as ImageUploadComponent } from './view/ImageUpload'
⋮----
interface Commands<ReturnType> {
    imageUpload: {
      setImageUpload: () => ReturnType
    }
  }
⋮----
parseHTML()
renderHTML()
addCommands()
addNodeView()
````

## File: src/features/mindmap/components/note/extensions/ImageUpload/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/Link/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/Link/Link.ts
````typescript
import { mergeAttributes } from '@tiptap/core'
import TiptapLink from '@tiptap/extension-link'
import { Plugin } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
⋮----
parseHTML()
renderHTML(
addProseMirrorPlugins()
````

## File: src/features/mindmap/components/note/extensions/MultiColumn/menus/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/MultiColumn/Column.ts
````typescript
import { Node, mergeAttributes } from '@tiptap/core'
⋮----
addAttributes()
renderHTML(
parseHTML()
````

## File: src/features/mindmap/components/note/extensions/MultiColumn/Columns.ts
````typescript
import { Node } from '@tiptap/core'
export enum ColumnLayout {
  SidebarLeft = 'sidebar-left',
  SidebarRight = 'sidebar-right',
  TwoColumn = 'two-column',
}
⋮----
interface Commands<ReturnType> {
    columns: {
      setColumns: () => ReturnType
      setLayout: (layout: ColumnLayout) => ReturnType
    }
  }
⋮----
addAttributes()
addCommands()
renderHTML(
parseHTML()
````

## File: src/features/mindmap/components/note/extensions/MultiColumn/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/Selection/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/Selection/Selection.ts
````typescript
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
⋮----
addProseMirrorPlugins()
⋮----
decorations(state)
````

## File: src/features/mindmap/components/note/extensions/SlashCommand/CommandButton.tsx
````typescript
import { forwardRef } from 'react'
import { cn } from '@/utils'
import { icons } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'
export type CommandButtonProps = {
  active?: boolean
  description: string
  icon: keyof typeof icons
  onClick: () => void
  title: string
}
````

## File: src/features/mindmap/components/note/extensions/SlashCommand/groups.ts
````typescript
import { Group } from './types'
````

## File: src/features/mindmap/components/note/extensions/SlashCommand/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/SlashCommand/MenuList.tsx
````typescript
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Command, MenuListProps } from './types'
import { CommandButton } from './CommandButton'
import { Surface } from '@/components/ui/Surface'
import { DropdownButton } from '@/components/ui/Dropdown'
import { Icon } from '@/components/ui/Icon'
⋮----
onClick=
````

## File: src/features/mindmap/components/note/extensions/SlashCommand/types.ts
````typescript
import { Editor } from '@tiptap/core'
import { icons } from 'lucide-react'
export interface Group {
  name: string
  title: string
  commands: Command[]
}
export interface Command {
  name: string
  label: string
  description: string
  aliases?: string[]
  iconName: keyof typeof icons
  action: (editor: Editor) => void
  shouldBeHidden?: (editor: Editor) => boolean
}
export interface MenuListProps {
  editor: Editor
  items: Group[]
  command: (command: Command) => void
}
````

## File: src/features/mindmap/components/note/extensions/Table/menus/TableColumn/utils.ts
````typescript
import { Editor } from '@tiptap/react'
import { EditorState } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
import { isTableSelected } from '../../utils'
import { Table } from '../..'
export const isColumnGripSelected = ({
  editor,
  view,
  state,
  from,
}: {
  editor: Editor
  view: EditorView
  state: EditorState
  from: number
}) =>
````

## File: src/features/mindmap/components/note/extensions/Table/menus/TableRow/utils.ts
````typescript
import { Editor } from '@tiptap/react'
import { EditorState } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
import { isTableSelected } from '../../utils'
import { Table } from '../..'
export const isRowGripSelected = ({
  editor,
  view,
  state,
  from,
}: {
  editor: Editor
  view: EditorView
  state: EditorState
  from: number
}) =>
````

## File: src/features/mindmap/components/note/extensions/Table/menus/index.tsx
````typescript

````

## File: src/features/mindmap/components/note/extensions/Table/Cell.ts
````typescript
import { mergeAttributes, Node } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { getCellsInColumn, isRowSelected, selectRow } from './utils'
export interface TableCellOptions {
  HTMLAttributes: Record<string, any>
}
⋮----
addOptions()
parseHTML()
renderHTML(
addAttributes()
addProseMirrorPlugins()
````

## File: src/features/mindmap/components/note/extensions/Table/Header.ts
````typescript
import TiptapTableHeader from '@tiptap/extension-table-header'
import { Plugin } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { getCellsInRow, isColumnSelected, selectColumn } from './utils'
⋮----
addAttributes()
addProseMirrorPlugins()
````

## File: src/features/mindmap/components/note/extensions/Table/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/Table/Row.ts
````typescript
import TiptapTableRow from '@tiptap/extension-table-row'
````

## File: src/features/mindmap/components/note/extensions/Table/Table.ts
````typescript
import TiptapTable from '@tiptap/extension-table'
````

## File: src/features/mindmap/components/note/extensions/Table/utils.ts
````typescript
import { findParentNode } from '@tiptap/core'
import { Selection, Transaction } from '@tiptap/pm/state'
import { CellSelection, TableMap } from '@tiptap/pm/tables'
import { Node, ResolvedPos } from '@tiptap/pm/model'
export const isRectSelected = (rect: any) => (selection: CellSelection) =>
export const findTable = (selection: Selection)
export const isCellSelection = (selection: any)
export const isColumnSelected = (columnIndex: number) => (selection: any) =>
export const isRowSelected = (rowIndex: number) => (selection: any) =>
export const isTableSelected = (selection: any) =>
export const getCellsInColumn = (columnIndex: number | number[]) => (selection: Selection) =>
export const getCellsInRow = (rowIndex: number | number[]) => (selection: Selection) =>
export const getCellsInTable = (selection: Selection) =>
export const findParentNodeClosestToPos = ($pos: ResolvedPos, predicate: (node: Node) => boolean) =>
export const findCellClosestToPos = ($pos: ResolvedPos) =>
⋮----
const predicate = (node: Node)
⋮----
const select = (type: 'row' | 'column') => (index: number) => (tr: Transaction) =>
⋮----
export const selectTable = (tr: Transaction) =>
````

## File: src/features/mindmap/components/note/extensions/TableOfContentsNode/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/TableOfContentsNode/TableOfContentsNode.tsx
````typescript
import { Node, NodeViewRendererProps } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { TableOfContents } from '@/components/TableOfContents'
const TableOfNodeContent = (props: NodeViewRendererProps) =>
⋮----
interface Commands<ReturnType> {
    tableOfContentsNode: {
      insertTableOfContents: () => ReturnType
    }
  }
⋮----
parseHTML()
renderHTML(
addNodeView()
addCommands()
````

## File: src/features/mindmap/components/note/extensions/TrailingNode/index.ts
````typescript

````

## File: src/features/mindmap/components/note/extensions/extension-kit.ts
````typescript
import { HocuspocusProvider } from '@hocuspocus/provider'
import { API } from '@/services/api'
import {
  AiWriter,
  AiImage,
  BlockquoteFigure,
  CharacterCount,
  Color,
  Document,
  Dropcursor,
  Emoji,
  Figcaption,
  FileHandler,
  Focus,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalRule,
  ImageBlock,
  Link,
  Placeholder,
  Selection,
  SlashCommand,
  StarterKit,
  Subscript,
  Superscript,
  Table,
  TableOfContents,
  TableCell,
  TableHeader,
  TableRow,
  TextAlign,
  TextStyle,
  TrailingNode,
  Typography,
  Underline,
  emojiSuggestion,
  Columns,
  Column,
  TaskItem,
  TaskList,
} from '.'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { ImageUpload } from './ImageUpload'
import { TableOfContentsNode } from './TableOfContentsNode'
import { lowlight } from 'lowlight'
interface ExtensionKitProps {
  provider?: HocuspocusProvider | null
  userId?: string
  userName?: string
  userColor?: string
}
export const ExtensionKit = ({
  provider,
  userId,
  userName = 'Maxi',
}: ExtensionKitProps) => [
  Document,
  Columns,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  AiWriter.configure({
    authorId: userId,
    authorName: userName,
  }),
  AiImage.configure({
    authorId: userId,
    authorName: userName,
  }),
  Column,
  Selection,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  HorizontalRule,
  StarterKit.configure({
    document: false,
    dropcursor: false,
    heading: false,
    horizontalRule: false,
    blockquote: false,
    history: false,
    codeBlock: false,
  }),
  CodeBlockLowlight.configure({
    lowlight,
    defaultLanguage: null,
  }),
  TextStyle,
  FontSize,
  FontFamily,
  Color,
  TrailingNode,
  Link.configure({
    openOnClick: false,
  }),
  Highlight.configure({ multicolor: true }),
  Underline,
  CharacterCount.configure({ limit: 50000 }),
  TableOfContents,
  TableOfContentsNode,
  ImageUpload.configure({
    clientId: provider?.document?.clientID,
  }),
  ImageBlock,
  FileHandler.configure({
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
onDrop: (currentEditor, files, pos) =>
⋮----
addKeyboardShortcuts()
````

## File: src/features/mindmap/components/note/hooks/useAIState.tsx
````typescript
import { useState } from 'react'
export type AIStateType = {
  isAiLoading: boolean
  aiError?: string | null
  setIsAiLoading: (isAiLoading: boolean) => void
  setAiError: (aiError: string | null) => void
}
export const useAIState = (): AIStateType =>
````

## File: src/features/mindmap/components/note/hooks/useBlockEditor.ts
````typescript
import { useContext, useEffect, useMemo, useState } from 'react'
import { Editor, useEditor } from '@tiptap/react'
import Ai from '@tiptap-pro/extension-ai'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { TiptapCollabProvider, WebSocketStatus } from '@hocuspocus/provider'
import type { Doc as YDoc } from 'yjs'
import { ExtensionKit } from '@/extensions/extension-kit'
import { EditorContext } from '../context/EditorContext'
import { userColors, userNames } from '../lib/constants'
import { randomElement } from '../lib/utils'
import { EditorUser } from '../components/BlockEditor/types'
import { useSidebar } from './useSidebar'
import { initialContent } from '@/services/data/initialContent'
⋮----
interface Window {
    editor: Editor | null
  }
⋮----
export const useBlockEditor = ({
  aiToken,
  ydoc,
  provider,
}: {
  aiToken: string
  ydoc: YDoc
  provider?: TiptapCollabProvider | null | undefined
}) =>
````

## File: src/features/mindmap/components/note/hooks/useSidebar.tsx
````typescript
import { useCallback, useState } from 'react'
export type SidebarState = {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}
export const useSidebar = (): SidebarState =>
````

## File: src/features/mindmap/components/note/lib/data/initialContent.tsx
````typescript

````

## File: src/features/mindmap/components/note/lib/utils/cssVar.ts
````typescript
export const cssVar = (name: string, value?: string) =>
````

## File: src/features/mindmap/components/note/lib/utils/getConnectionText.ts
````typescript
import { WebSocketStatus } from '@hocuspocus/provider'
export const getConnectionText = (collabState: WebSocketStatus) =>
````

## File: src/features/mindmap/components/note/lib/utils/getRenderContainer.ts
````typescript
import { Editor } from '@tiptap/react'
export const getRenderContainer = (editor: Editor, nodeType: string) =>
````

## File: src/features/mindmap/components/note/lib/utils/index.ts
````typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[])
export function randomElement(array: Array<any>)
````

## File: src/features/mindmap/components/note/lib/utils/isCustomNodeSelected.ts
````typescript
import { Editor } from '@tiptap/react'
import { AiWriter, AiImage, Figcaption, HorizontalRule, ImageBlock, ImageUpload, Link, CodeBlock } from '@/extensions'
import { TableOfContentsNode } from '@/extensions/TableOfContentsNode'
export const isTableGripSelected = (node: HTMLElement) =>
export const isCustomNodeSelected = (editor: Editor, node: HTMLElement) =>
````

## File: src/features/mindmap/components/note/lib/utils/isTextSelected.ts
````typescript
import { isTextSelection } from '@tiptap/core'
import { Editor } from '@tiptap/react'
export const isTextSelected = (
````

## File: src/features/mindmap/components/note/lib/api.ts
````typescript
export class API
````

## File: src/features/mindmap/components/note/lib/constants.tsx
````typescript
import type {
	AiToneOption,
	LanguageOption,
} from "@/features/mindmap/components/note/BlockEditor/types";
````

## File: src/features/mindmap/components/note/menus/ContentItemMenu/hooks/useContentItemActions.tsx
````typescript
import { Node } from '@tiptap/pm/model'
import { NodeSelection } from '@tiptap/pm/state'
import { Editor } from '@tiptap/react'
import { useCallback } from 'react'
const useContentItemActions = (
  editor: Editor,
  currentNode: Node | null,
  currentNodePos: number
) =>
````

## File: src/features/mindmap/components/note/menus/ContentItemMenu/hooks/useData.tsx
````typescript
import { Node } from '@tiptap/pm/model'
import { Editor } from '@tiptap/core'
import { useCallback, useState } from 'react'
export const useData = () =>
````

## File: src/features/mindmap/components/note/menus/ContentItemMenu/index.tsx
````typescript

````

## File: src/features/mindmap/components/note/menus/LinkMenu/index.tsx
````typescript

````

## File: src/features/mindmap/components/note/menus/LinkMenu/LinkMenu.tsx
````typescript
import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react'
import React, { useCallback, useState } from 'react'
import { MenuProps } from '../types'
import { LinkPreviewPanel } from '@/components/panels/LinkPreviewPanel'
import { LinkEditorPanel } from '@/components/panels'
````

## File: src/features/mindmap/components/note/menus/TextMenu/hooks/useTextmenuCommands.ts
````typescript
import { Language } from '@tiptap-pro/extension-ai'
import { Editor } from '@tiptap/react'
import { useCallback } from 'react'
export const useTextmenuCommands = (editor: Editor) =>
````

## File: src/features/mindmap/components/note/menus/TextMenu/hooks/useTextmenuContentTypes.ts
````typescript
import { Editor } from '@tiptap/react'
import { useMemo } from 'react'
import { ContentPickerOptions } from '../components/ContentTypePicker'
export const useTextmenuContentTypes = (editor: Editor) =>
````

## File: src/features/mindmap/components/note/menus/TextMenu/hooks/useTextmenuStates.ts
````typescript
import { Editor } from '@tiptap/react'
import { useCallback, useMemo } from 'react'
import { ShouldShowProps } from '../../types'
import { isCustomNodeSelected, isTextSelected } from '@/services/utils'
export const useTextmenuStates = (editor: Editor) =>
````

## File: src/features/mindmap/components/note/menus/TextMenu/index.tsx
````typescript

````

## File: src/features/mindmap/components/note/menus/index.ts
````typescript

````

## File: src/features/mindmap/components/note/menus/types.ts
````typescript
import React from 'react'
import { Editor as CoreEditor } from '@tiptap/core'
import { Editor } from '@tiptap/react'
import { EditorState } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
export interface MenuProps {
  editor: Editor
  appendTo?: React.RefObject<any>
  shouldHide?: boolean
}
export interface ShouldShowProps {
  editor?: CoreEditor
  view: EditorView
  state?: EditorState
  oldState?: EditorState
  from?: number
  to?: number
}
````

## File: src/features/mindmap/components/note/panels/Colorpicker/Colorpicker.tsx
````typescript
import { useCallback, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { ColorButton } from './ColorButton'
import { Toolbar } from '../../ui/Toolbar'
import { Icon } from '../../ui/Icon'
import { themeColors } from '@/services/constants'
export type ColorPickerProps = {
  color?: string
  onChange?: (color: string) => void
  onClear?: () => void
}
export const ColorPicker = (
````

## File: src/features/mindmap/components/note/panels/Colorpicker/index.tsx
````typescript

````

## File: src/features/mindmap/components/note/panels/LinkEditorPanel/index.tsx
````typescript

````

## File: src/features/mindmap/components/note/panels/LinkEditorPanel/LinkEditorPanel.tsx
````typescript
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Surface } from '@/components/ui/Surface'
import { Toggle } from '@/components/ui/Toggle'
import { useState, useCallback, useMemo } from 'react'
export type LinkEditorPanelProps = {
  initialUrl?: string
  initialOpenInNewTab?: boolean
  onSetLink: (url: string, openInNewTab?: boolean) => void
}
export const useLinkEditorState = (
````

## File: src/features/mindmap/components/note/panels/LinkPreviewPanel/index.tsx
````typescript

````

## File: src/features/mindmap/components/note/panels/index.tsx
````typescript

````

## File: src/features/mindmap/components/note/Sidebar/index.tsx
````typescript

````

## File: src/features/mindmap/components/note/Sidebar/Sidebar.tsx
````typescript
import { cn } from '@/utils'
import { memo, useCallback } from 'react'
import { Editor } from '@tiptap/react'
import { TableOfContents } from '../TableOfContents'
````

## File: src/features/mindmap/components/note/TableOfContents/index.tsx
````typescript

````

## File: src/features/mindmap/components/note/TableOfContents/TableOfContents.tsx
````typescript
import { Editor as CoreEditor } from '@tiptap/core'
import { memo, useEffect, useState } from 'react'
import { TableOfContentsStorage } from '@tiptap-pro/extension-table-of-contents'
import { cn } from '@/utils'
export type TableOfContentsProps = {
  editor: CoreEditor
  onItemClick?: () => void
}
⋮----
const handler = (
⋮----
className=
````

## File: src/features/mindmap/components/note/ui/Button/Button.tsx
````typescript
import { cn } from '@/utils'
import React from 'react'
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'quaternary'
  | 'ghost'
export type ButtonSize = 'medium' | 'small' | 'icon' | 'iconSmall'
export type ButtonProps = {
  variant?: ButtonVariant
  active?: boolean
  activeClassname?: string
  buttonSize?: ButtonSize
} & React.ButtonHTMLAttributes<HTMLButtonElement>
````

## File: src/features/mindmap/components/note/ui/Button/hover-expand-button.tsx
````typescript
import { ChevronDown, SparklesIcon } from 'lucide-react'
import React from 'react'
export function HoverExpandButton(
````

## File: src/features/mindmap/components/note/ui/Button/index.tsx
````typescript

````

## File: src/features/mindmap/components/note/ui/Button/shiny-button.tsx
````typescript
import { motion } from 'framer-motion'
import React from 'react'
````

## File: src/features/mindmap/components/note/ui/Dropdown/Dropdown.tsx
````typescript
import { cn } from '@/utils'
export const DropdownCategoryTitle = ( {
  children,
}: {
  children: React.ReactNode
} ) =>
export const DropdownButton = ( {
  children,
  isActive,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode
  isActive?: boolean
  onClick?: () => void
  disabled?: boolean
  className?: string
} ) =>
````

## File: src/features/mindmap/components/note/ui/Dropdown/index.tsx
````typescript

````

## File: src/features/mindmap/components/note/ui/Loader/index.ts
````typescript

````

## File: src/features/mindmap/components/note/ui/Loader/Loader.tsx
````typescript
import { createPortal } from 'react-dom'
import { LoaderProps, LoadingWrapperProps } from './types'
const LoadingWrapper = (
export const Loader = (
````

## File: src/features/mindmap/components/note/ui/Loader/types.ts
````typescript
export interface LoadingWrapperProps {
  label?: string
}
export interface LoaderProps extends LoadingWrapperProps {
  hasOverlay?: boolean
}
````

## File: src/features/mindmap/components/note/ui/Panel/index.tsx
````typescript
import { forwardRef } from 'react'
import { cn } from '@/utils'
import { Slot } from '@radix-ui/react-slot'
import { Surface } from '../Surface'
export type PanelProps = {
  spacing?: 'medium' | 'small'
  noShadow?: boolean
  asChild?: boolean
} & React.HTMLAttributes<HTMLDivElement>
````

## File: src/features/mindmap/components/note/ui/Spinner/index.tsx
````typescript

````

## File: src/features/mindmap/components/note/ui/Spinner/Spinner.tsx
````typescript
import { cn } from '@/utils'
import { HTMLProps, forwardRef } from 'react'
````

## File: src/features/mindmap/components/note/ui/Textarea/index.tsx
````typescript

````

## File: src/features/mindmap/components/note/ui/Textarea/Textarea.tsx
````typescript
import { forwardRef } from 'react'
import { cn } from '@/utils'
````

## File: src/features/mindmap/components/note/ui/Toggle/index.tsx
````typescript

````

## File: src/features/mindmap/components/note/ui/Toggle/Toggle.tsx
````typescript
import { cn } from '@/utils'
import { useCallback } from 'react'
export type ToggleProps = {
  active?: boolean
  onChange: ( active: boolean ) => void
  size?: 'small' | 'large'
}
export const Toggle = ( {
  onChange,
  active = false,
  size = 'large',
}: ToggleProps ) =>
````

## File: src/features/mindmap/components/note/ui/Tooltip/types.ts
````typescript
import React from 'react'
import { Placement, Props } from 'tippy.js'
export interface TooltipProps {
  children?: string | React.ReactNode
  enabled?: boolean
  title?: string
  shortcut?: string[]
  tippyOptions?: Omit<Partial<Props>, 'content'>
  content?: React.ReactNode
}
export interface TippyProps {
  'data-placement': Placement
  'data-reference-hidden'?: string
  'data-escaped'?: string
}
````

## File: src/features/mindmap/components/note/ui/Icon.tsx
````typescript
import { cn } from '@/utils'
import { icons } from 'lucide-react'
import { memo } from 'react'
export type IconProps = {
  name: keyof typeof icons
  className?: string
  strokeWidth?: number
}
````

## File: src/features/mindmap/components/note/ui/PopoverMenu.tsx
````typescript
import { cn } from '@/utils'
import { icons } from 'lucide-react'
import { forwardRef } from 'react'
import { Surface } from './Surface'
import { Toolbar } from './Toolbar'
⋮----
export type MenuProps = {
  children: React.ReactNode
  trigger: React.ReactNode
  triggerClassName?: string
  customTrigger?: boolean
  isOpen?: boolean
  onOpenChange?: ( state: boolean ) => void
  withPortal?: boolean
  tooltip?: string
  isActive?: boolean
}
````

## File: src/features/mindmap/components/note/ui/Surface.tsx
````typescript
import { cn } from '@/utils'
import { HTMLProps, forwardRef } from 'react'
export type SurfaceProps = HTMLProps<HTMLDivElement> & {
  withShadow?: boolean
  withBorder?: boolean
}
````

## File: src/features/mindmap/components/note/ui/Toolbar.tsx
````typescript
import React, { ButtonHTMLAttributes, HTMLProps, forwardRef } from 'react'
import { cn } from '@/utils'
import { Surface } from './Surface'
import { Button, ButtonProps } from './Button'
import Tooltip from './Tooltip'
export type ToolbarWrapperProps = {
  shouldShowContent?: boolean
  isVertical?: boolean
} & HTMLProps<HTMLDivElement>
⋮----
export type ToolbarDividerProps = {
  horizontal?: boolean
} & HTMLProps<HTMLDivElement>
⋮----
export type ToolbarButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
  activeClassname?: string
  tooltip?: string
  tooltipShortcut?: string[]
  buttonSize?: ButtonProps['buttonSize']
  variant?: ButtonProps['variant']
}
````

## File: src/features/mindmap/components/note/index.tsx
````typescript

````

## File: src/features/mindmap/components/note/Note.tsx
````typescript
import { useEditor, EditorContent } from '@tiptap/react'
export interface NoteProps {}
export const Note: React.FC<NoteProps> = (props: NoteProps) =>
````

## File: src/features/mindmap/components/status-ui/agent-notifications-log.stories.tsx
````typescript
import type { Meta, StoryObj } from '@storybook/react'
import { AgentNotificationsLog } from './agent-notifications-log'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/features/mindmap/components/status-ui/agent-notifications-log.tsx
````typescript
import { EllipsesScramble } from "@/components/animated/text-effect/text-scramble/ellipses-scramble";
import { TerminalIcon } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { ICON_GREEN } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Terminal } from "lucide-react";
interface Notification {
	id: number;
	message: string;
	isScrambled?: boolean;
	timestamp: Date;
}
⋮----
onHoverEnd=
onClick=
````

## File: src/features/mindmap/components/status-ui/case-files-and-evidence-board.stories.tsx
````typescript
import type { Meta, StoryObj } from '@storybook/react'
import { CaseFilesAndEvidenceBoard } from './case-files-and-evidence-board'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/features/mindmap/components/status-ui/graph-status-log.stories.tsx
````typescript
import type {Meta, StoryObj} from '@storybook/react'
import {GraphStatusLog} from './graph-status-log'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/features/mindmap/components/status-ui/graph-status-log.tsx
````typescript
import { EllipsesScramble } from "@/components/animated/text-effect/text-scramble/ellipses-scramble";
import { TextScramble } from "@/components/animated/text-effect/text-scramble/text-scramble";
import { TerminalIcon } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { ICON_GREEN } from "@/utils";
import { AnimatePresence } from "framer-motion";
export const GraphStatusLog = () =>
````

## File: src/features/mindmap/components/status-ui/index.tsx
````typescript

````

## File: src/features/mindmap/components/status-ui/session-notes.stories.tsx
````typescript
import type {Meta, StoryObj} from '@storybook/react'
import {SessionNotes} from './session-notes'
import {useEffect, useState} from 'react'
import {within, userEvent} from '@storybook/test'
⋮----
type Story = StoryObj<typeof meta>
⋮----
const AutoOpenSessionNotes = () =>
⋮----
const AutoOpenNestedSessionNotes = () =>
````

## File: src/features/mindmap/components/base-handle.tsx
````typescript
import { forwardRef } from "react";
import { Handle, HandleProps } from "@xyflow/react";
import { cn } from "@/utils";
export type BaseHandleProps = HandleProps;
⋮----
className=
````

## File: src/features/mindmap/components/button-handle.tsx
````typescript
import { BaseHandle } from "@/features/mindmap/components/base-handle";
import { type HandleProps, Position } from "@xyflow/react";
````

## File: src/features/mindmap/components/connection-list.tsx
````typescript
import React, {
  memo,
  useEffect,
  useRef,
  forwardRef,
  useState,
  createContext,
  useContext,
  useCallback,
} from 'react'
import { AnimatedBeam } from '@/components/animated/animated-beam'
import { Waypoints } from 'lucide-react'
import {
  AnimatePresence,
  motion,
  stagger,
  useAnimate,
  useInView,
  usePresence,
} from 'framer-motion'
import { cn } from '@/utils/cn'
import { BlurFade } from '@/components/animated/blur-fade/BlurFade'
import { DotPattern } from '@/components/backgrounds/dot-pattern'
import { formatModelWithImage } from '@/utils/image.utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import type { AnyComponent } from 'styled-components/dist/types'
import { CardHeader, CardContent, Card } from '@/components/ui/card'
import { truncate } from '@/utils/functions'
export const ModelAvatar = (
⋮----
const splitName = ( name: string ): string =>
⋮----
export const ConnectionCard = (
⋮----
className=
````

## File: src/features/mindmap/components/labeled-handle.tsx
````typescript
import { cn } from "@/utils";
import type { HandleProps } from "@xyflow/react";
import React from "react";
import { BaseHandle } from "@/features/mindmap/components/base-handle";
function getFlexDirection(position: string)
⋮----
className=
````

## File: src/features/mindmap/components/node-status-indicator.tsx
````typescript
import React, { ReactNode } from "react";
import clsx from "clsx";
export type NodeStatusIndicatorProps = {
  status?: "loading" | "success" | "error" | "initial";
  children: ReactNode;
};
export const LoadingIndicator = (
const StatusBorder = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) =>
⋮----
className=
⋮----
export const NodeStatusIndicator = ({
  status,
  children,
}: NodeStatusIndicatorProps) =>
````

## File: src/features/mindmap/config/functions.ts
````typescript
import { MarkerType, Position } from '@xyflow/react'
function getNodeIntersection(
  intersectionNode: {
    measured: { width: any; height: any }
    internals: { positionAbsolute: any }
  },
  targetNode: {
    internals: { positionAbsolute: any }
    measured: { width: number; height: number }
  }
)
function getEdgePosition(
  node: { internals: { positionAbsolute: any } },
  intersectionPoint: { x: any; y: any }
)
export function getEdgeParams( source: any, target: any )
export function createNodesAndEdges()
````

## File: src/features/mindmap/config/index.config.ts
````typescript

````

## File: src/features/mindmap/config/initial-nodes.ts
````typescript
import {
  ROOT_DIMENSIONS,
  ROOT_NODE_IDS,
  ROOT_NODE_POSITIONS,
} from '@/features/mindmap/config/index.config'
import { ENTITY_DATA_VIZ_COLOR_PALETTE } from '@/utils'
````

## File: src/features/mindmap/config/nodes.config.ts
````typescript

````

## File: src/features/mindmap/edges/animated-svg-edge.tsx
````typescript
import React, { FC } from "react";
import type { Edge, EdgeProps, Position } from "@xyflow/react";
import {
  BaseEdge,
  getBezierPath,
  getStraightPath,
  getSmoothStepPath,
} from "@xyflow/react";
export type AnimatedSvgEdge = Edge<{
  duration: number;
  direction?: "forward" | "reverse" | "alternate" | "alternate-reverse";
  path?: "bezier" | "smoothstep" | "step" | "straight";
  repeat?: number | "indefinite";
  shape: keyof typeof shapes;
}>;
export function AnimatedSvgEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data = {
    duration: 2,
    direction: "forward",
    path: "bezier",
    repeat: "indefinite",
    shape: "circle",
  },
  ...delegated
}: EdgeProps<AnimatedSvgEdge>)
type AnimateMotionProps = {
  dur: string;
  keyTimes: string;
  keyPoints: string;
  repeatCount: number | "indefinite";
  path: string;
};
type AnimatedSvg = FC<{ animateMotionProps: AnimateMotionProps }>;
⋮----
switch (direction)
````

## File: src/features/mindmap/edges/button-edge.tsx
````typescript
import { ReactNode } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "@xyflow/react";
export const ButtonEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  children,
}: EdgeProps &
````

## File: src/features/mindmap/edges/data-edge.tsx
````typescript
import {
  BaseEdge,
  Edge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  Node,
  Position,
  useStore,
} from "@xyflow/react";
import { useMemo } from "react";
export type DataEdge<T extends Node = Node> = Edge<{
  key?: keyof T["data"];
  path?: "bezier" | "smoothstep" | "step" | "straight";
}>;
````

## File: src/features/mindmap/edges/FloatingConnectionLine.tsx
````typescript
import { getEdgeParams } from '@/features/mindmap/config/functions'
import { getBezierPath } from '@xyflow/react'
````

## File: src/features/mindmap/edges/FloatingEdge.tsx
````typescript
import { getEdgeParams } from '@/features/mindmap/config/index.config'
import { getBezierPath, useInternalNode } from '@xyflow/react'
interface FloatingEdgeProps {
  id: string
  source: string
  target: string
  markerEnd?: string
  style?: React.CSSProperties
}
export function FloatingEdge(
````

## File: src/features/mindmap/edges/FlowEdge.tsx
````typescript
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from '@xyflow/react'
⋮----
const onEdgeClick = () =>
````

## File: src/features/mindmap/edges/index.tsx
````typescript

````

## File: src/features/mindmap/edges/RootEdge.tsx
````typescript
import React from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from '@xyflow/react'
import { NEONS } from '@/utils'
import { StarDoodle } from '@/components/icons'
type SiblingEdgeProps = {
  data: { sourceType: string; targetType: string }
}
````

## File: src/features/mindmap/edges/SequentialEdge.tsx
````typescript
import { NEONS } from '@/utils'
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react'
````

## File: src/features/mindmap/edges/SiblingEdge.tsx
````typescript
import { useMindMap } from '@/contexts'
import { NEONS } from '@/utils'
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@xyflow/react'
import { getSmartEdge } from '@tisoap/react-flow-smart-edge'
import { motion } from 'framer-motion'
type SiblingEdgeProps = {
  data: { sourceType: string; targetType: string }
}
````

## File: src/features/mindmap/hooks/useAnimateNodes.tsx
````typescript
import { useEffect, useState } from 'react'
import { timer } from 'd3-timer'
import { useReactFlow } from '@xyflow/react'
export type UseAnimatedNodeOptions = {
  animationDuration?: number
}
function useAnimatedNodes(
  nodes: Node[],
  { animationDuration = 300 }: UseAnimatedNodeOptions = {}
)
````

## File: src/features/mindmap/hooks/useAskXata.ts
````typescript
import { useEffect, useRef, useState, useCallback } from "react";
import { fetchRecords } from "@/features/mindmap/actions/xata-to-xyflow";
type XataRecord = Record<string, unknown>;
interface XataMessage {
	text?: string;
	done?: boolean;
	records?: string[];
	sessionId?: string;
	error?: string;
}
interface UseAskXataOptions {
	onStreamingUpdate?: (text: string) => void;
	onComplete?: (data: {
		answer: string;
		records: XataRecord[];
		sessionId: string;
	}) => void;
	onError?: (error: Error) => void;
	endpoint?: string;
}
interface AskXataParams {
	question: string;
	table: string;
	rules?: string[];
	sessionId?: string;
}
export function useAskXata(options: UseAskXataOptions =
⋮----
// Connection refs
⋮----
// Cleanup function
⋮----
// Error handler
⋮----
// Set up SSE connection
⋮----
// Skip if server-side or not streaming
⋮----
// Update session ID
⋮----
// Handle explicit done flag (might not be needed if records signal completion)
⋮----
// Handle connection errors
⋮----
// Cleanup on unmount or when streaming stops
⋮----
// Start a streaming question to Xata
⋮----
// Store the active query and reset state
⋮----
// Ensure connection is established before sending query (fixes race condition)
⋮----
// Wait for connection to open
⋮----
// Send the query via POST
⋮----
// The POST request is now in progress, events will come through EventSource
````

## File: src/features/mindmap/hooks/useAutoLayout.tsx
````typescript
import { layoutAlgorithms } from '@/features/mindmap/layouts'
import type { LayoutAlgorithmOptions } from '@/features/mindmap/layouts/algorithms'
import {
  getSourceHandlePosition,
  getTargetHandlePosition,
} from '@/features/mindmap/layouts/utils'
import {
  useReactFlow,
  useNodesInitialized,
  useStore,
  type Node,
  type Edge,
} from '@xyflow/react'
import { useEffect } from 'react'
export type LayoutOptions = {
  algorithm: keyof typeof layoutAlgorithms
} & LayoutAlgorithmOptions
function useAutoLayout( options: LayoutOptions )
⋮----
const runLayout = async () =>
⋮----
type Elements = {
  nodeMap: Map<string, Node>
  edgeMap: Map<string, Edge>
}
function compareElements( xs: Elements, ys: Elements )
function compareNodes( xs: Map<string, Node>, ys: Map<string, Node> )
function compareEdges( xs: Map<string, Edge>, ys: Map<string, Edge> )
````

## File: src/features/mindmap/hooks/useAutoLayoutAlt.tsx
````typescript
import {
  type ILayoutReactflow,
  layoutReactflow,
} from '@/features/mindmap/layouts'
import { useState } from 'react'
import { useReactFlow } from '@xyflow/react'
import { nextTick } from '@/utils'
import { getRootNode } from '@/features/mindmap/utils/node.utils'
export const layoutWithFlush = async (
  reactFlow: any,
  options: ILayoutReactflow
) =>
export const useAutoLayoutAlternative = () =>
⋮----
const layout = async ( options: ILayoutReactflow ) =>
````

## File: src/features/mindmap/hooks/useExpandCollapse.tsx
````typescript
import { useMemo } from 'react'
import { stratify, tree } from 'd3-hierarchy'
export type UseExpandCollapseOptions = {
  layoutNodes?: boolean
  treeWidth?: number
  treeHeight?: number
}
function isHierarchyPointNode(pointNode: any): pointNode is Node
export function useExpandCollapse(
  nodes: Node[],
  edges: any[],
  childrenLoaded,
  {
    layoutNodes = true,
    treeWidth = 220,
    treeHeight = 100,
  }: UseExpandCollapseOptions = {}
):
````

## File: src/features/mindmap/hooks/useForceLayout.tsx
````typescript
import { collide } from '@/features/mindmap/layouts/collide'
import { useMindMap } from '@/contexts'
import { nextTick } from '@/utils'
import {
  type ReactFlowState,
  useEdges,
  useNodes,
  useNodesInitialized,
  useReactFlow,
  useStore,
  useStoreApi,
} from '@xyflow/react'
import {
  type SimulationNodeDatum,
  type SimulationLinkDatum,
  forceSimulation,
  forceManyBody,
  forceLink,
  forceX,
  forceY,
  forceCenter,
} from 'd3-force'
import { useEffect, useMemo, useRef, useState } from 'react'
type UseForceLayoutOptions = {
  strength: number
  distance: number
}
⋮----
export const useForceLayout = () =>
````

## File: src/features/mindmap/hooks/useRootNodesHierarchy.tsx
````typescript
import { useMemo } from 'react'
import { stratify, tree, hierarchy as d3Hierarchy } from 'd3-hierarchy'
export type UseExpandCollapseOptions = {
  layoutNodes?: boolean
  treeWidth?: number
  treeHeight?: number
}
function isHierarchyPointNode(pointNode: any): any
export const useRootNodesHierarchy = (
  nodes: Node[],
  edges: any[],
  childrenLoaded: any,
  {
    layoutNodes = true,
    treeWidth = 220,
    treeHeight = 100,
  }: UseExpandCollapseOptions = {}
):
````

## File: src/features/mindmap/hooks/useSyncChildNodePositions.tsx
````typescript
import { useMindMap } from '@/contexts'
import { debounce } from 'lodash'
import { useCallback, useMemo } from 'react'
interface Position {
  x: number
  y: number
}
interface UseSyncChildNodePositionsReturn {
  syncPosition: ( nodeId: string, position: Position ) => void
}
export const useSyncChildNodePositions = ( groupNodeId: string ): UseSyncChildNodePositionsReturn =>
````

## File: src/features/mindmap/layouts/algorithms/d3-dag.ts
````typescript
import type {
  LayoutAlgorithmProps,
  LayoutAlgorithm,
} from '@/features/mindmap/layouts/algorithms'
import type { ReactflowNodeWithData } from '@/features/mindmap/layouts/types'
import {
  getNodeSize,
  getNodeLayouted,
  getEdgeLayouted,
} from '@/features/mindmap/utils/node.utils'
import { getIncomers } from '@xyflow/react'
import { graphStratify, sugiyama } from 'd3-dag'
type NodeWithPosition = ReactflowNodeWithData & { x: number; y: number }
⋮----
export type D3DAGLayoutAlgorithms = 'd3-dag' | 'ds-dag(s)'
export const layoutD3DAG = async (
  props: LayoutAlgorithmProps & { algorithm?: D3DAGLayoutAlgorithms }
) =>
⋮----
const getParentIds = ( node: any ) =>
````

## File: src/features/mindmap/layouts/algorithms/d3-hierarchy.ts
````typescript
import { stratify, tree } from 'd3-hierarchy'
import { LayoutAlgorithm } from '..'
import type { ReactflowNodeWithData } from '@/features/mindmap/layouts/types'
import {
  getNodeSize,
  getNodeLayouted,
  getEdgeLayouted,
} from '@/features/mindmap/utils/node.utils'
import { getIncomers, type Node, type Edge } from '@xyflow/react'
type NodeWithPosition = ReactflowNodeWithData & { x: number; y: number }
⋮----
export const layoutD3Hierarchy: LayoutAlgorithm = async ( props ) =>
⋮----
const getParentId = ( node: Node ) =>
````

## File: src/features/mindmap/layouts/algorithms/dagre-tree.ts
````typescript
import dagre from '@dagrejs/dagre'
import { getIncomers } from '@xyflow/react'
import type { LayoutAlgorithm } from '@/features/mindmap/layouts/algorithms'
import {
  getNodeSize,
  getNodeLayouted,
  getEdgeLayouted,
} from '@/features/mindmap/utils/node.utils'
⋮----
export const layoutDagreTree: LayoutAlgorithm = async ( props ) =>
````

## File: src/features/mindmap/layouts/algorithms/elk-layout.ts
````typescript
import { useMindMap } from '@/contexts'
import { useNodesInitialized } from '@xyflow/react'
import ELK from 'elkjs/lib/elk.bundled.js'
import { useEffect } from 'react'
⋮----
export const renderElkLayout = async ( nodes: any[], edges: any[] ) =>
export function useElkLayout()
⋮----
const layoutNodes = async () =>
````

## File: src/features/mindmap/layouts/algorithms/elk.ts
````typescript
import ELK from 'elkjs/lib/elk.bundled.js'
import { LayoutAlgorithm } from '.'
import { getIncomers } from '@xyflow/react'
import {
  getEdgeLayouted,
  getNodeLayouted,
  getNodeSize,
} from '@/features/mindmap/utils/node.utils'
⋮----
export type ELKLayoutAlgorithms = 'elk-layered' | 'elk-mr-tree'
export const layoutELK = async (
  props: any & { algorithm?: ELKLayoutAlgorithms }
) =>
````

## File: src/features/mindmap/layouts/algorithms/index.ts
````typescript
import {
	kD3DAGAlgorithms,
	type D3DAGLayoutAlgorithms,
} from "@/features/mindmap/layouts/algorithms/d3-dag";
import { layoutD3Hierarchy } from "@/features/mindmap/layouts/algorithms/d3-hierarchy";
import { layoutDagreTree } from "@/features/mindmap/layouts/algorithms/dagre-tree";
import {
	kElkAlgorithms,
	type ELKLayoutAlgorithms,
} from "@/features/mindmap/layouts/algorithms/elk";
import { layoutOrigin } from "@/features/mindmap/layouts/algorithms/origin";
import { type Node, type Edge } from "@xyflow/react";
import { removeEmpty } from "@/utils";
import type { Reactflow } from "@/features/mindmap/layouts/types";
export type LayoutDirection = "vertical" | "horizontal";
export type LayoutVisibility = "visible" | "hidden";
export interface LayoutSpacing {
	x: number;
	y: number;
}
export type ReactflowLayoutConfig = {
	algorithm: LayoutAlgorithms;
	direction: LayoutDirection;
	spacing: LayoutSpacing;
	visibility: LayoutVisibility;
	reverseSourceHandles: boolean;
};
export type LayoutAlgorithmProps = any &
	Omit<ReactflowLayoutConfig, "algorithm">;
export type Direction = "TB" | "LR" | "RL" | "BT";
export type LayoutAlgorithmOptions = {
	direction: Direction;
	spacing: [number, number];
};
export type LayoutAlgorithm = (
	props: LayoutAlgorithmProps,
) => Promise<Reactflow | undefined>;
⋮----
export type LayoutAlgorithms =
	| "origin"
	| "dagre-tree"
	| "d3-hierarchy"
	| ELKLayoutAlgorithms
	| D3DAGLayoutAlgorithms;
````

## File: src/features/mindmap/layouts/algorithms/origin.ts
````typescript
import type { LayoutAlgorithm } from '@/features/mindmap/layouts/config'
import {
  getNodeLayouted,
  getEdgeLayouted,
} from '@/features/mindmap/utils/node.utils'
export const layoutOrigin: LayoutAlgorithm = async ( props ) =>
````

## File: src/features/mindmap/layouts/collide.ts
````typescript
export const collide = () =>
⋮----
const force = () =>
````

## File: src/features/mindmap/layouts/index.ts
````typescript
import { layoutOrigin } from "@/features/mindmap/layouts/algorithms/origin";
import type { Reactflow } from "@/features/mindmap/layouts/types";
import { removeEmpty } from "@/utils";
import {
	type D3DAGLayoutAlgorithms,
	kD3DAGAlgorithms,
} from "./algorithms/d3-dag";
import { layoutD3Hierarchy } from "./algorithms/d3-hierarchy";
import { layoutDagreTree } from "./algorithms/dagre-tree";
import { type ELKLayoutAlgorithms, kElkAlgorithms } from "./algorithms/elk";
export type LayoutDirection = "vertical" | "horizontal";
export type LayoutVisibility = "visible" | "hidden";
export interface LayoutSpacing {
	x: number;
	y: number;
}
export type ReactflowLayoutConfig = {
	algorithm: LayoutAlgorithms;
	direction: LayoutDirection;
	spacing: LayoutSpacing;
	visibility: LayoutVisibility;
	reverseSourceHandles: boolean;
};
export type LayoutAlgorithmProps = Reactflow &
	Omit<ReactflowLayoutConfig, "algorithm">;
export type LayoutAlgorithm = (
	props: LayoutAlgorithmProps,
) => Promise<Reactflow | undefined>;
⋮----
export type LayoutAlgorithms =
	| "origin"
	| "dagre-tree"
	| "d3-hierarchy"
	| ELKLayoutAlgorithms
	| D3DAGLayoutAlgorithms;
export type ILayoutReactflow = Reactflow & Partial<ReactflowLayoutConfig>;
export const layoutReactflow = async (
	options: ILayoutReactflow,
): Promise<Reactflow> =>
````

## File: src/features/mindmap/layouts/types.ts
````typescript
import type { XYPosition } from '@xyflow/react'
interface WorkflowNode {
  id: string
  type: string
}
interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle: string
  targetHandle: string
}
export interface Workflow {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}
export type ReactflowNode<
  D = any,
  T extends string | undefined = string | undefined,
> = any
export type ReactflowEdge<D = any> = any
export type ReactflowNodeData = WorkflowNode & {
  sourceHandles: string[]
  targetHandles: string[]
}
export interface ReactflowEdgePort {
  edges: number
  portCount: number
  portIndex: number
  edgeCount: number
  edgeIndex: number
}
export interface EdgeLayout {
  path: string
  points: any[]
  labelPosition: XYPosition
  deps?: any
  inputPoints: any[]
}
export interface ReactflowEdgeData {
  layout?: EdgeLayout
  sourcePort: ReactflowEdgePort
  targetPort: ReactflowEdgePort
}
export type ReactflowNodeWithData = ReactflowNode<ReactflowNodeData>
export type ReactflowEdgeWithData = ReactflowEdge<ReactflowEdgeData>
export interface Reactflow {
  nodes: ReactflowNodeWithData[]
  edges: ReactflowEdgeWithData[]
}
````

## File: src/features/mindmap/layouts/utils.ts
````typescript
import { Position } from '@xyflow/react'
export function getSourceHandlePosition(direction: any)
export function getTargetHandlePosition(direction: any)
export function getId()
````

## File: src/features/mindmap/nodes/user-input-node/anchor.tsx
````typescript
import { DOMAIN_MODEL_COLORS, cn } from "@/utils";
import chroma from "chroma-js";
import { motion } from "framer-motion";
import { forwardRef } from "react";
````

## File: src/features/mindmap/nodes/animated-node.tsx
````typescript
import React, { useEffect, useMemo } from "react";
import {
	BaseEdge,
	type Edge,
	type EdgeProps,
	getBezierPath,
	useReactFlow,
} from "@xyflow/react";
export type AnimatedNodeEdge = Edge<{ node: string }, "animatedNode">;
````

## File: src/features/mindmap/nodes/annotation-node.tsx
````typescript
import React, { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils";
export type AnnotationNodeProps = HTMLAttributes<HTMLDivElement>;
⋮----
className=
⋮----
export type AnnotationNodeNumberProps = HTMLAttributes<HTMLDivElement>;
⋮----
<div ref=
⋮----
export type AnnotationNodeContentProps = HTMLAttributes<HTMLDivElement>;
⋮----
export type AnnotationNodeIconProps = HTMLAttributes<HTMLDivElement>;
````

## File: src/features/mindmap/nodes/AnnotationNode.tsx
````typescript
import { memo } from "react";
````

## File: src/features/mindmap/nodes/base-node.tsx
````typescript
import React from "react";
import { cn } from "@/utils";
````

## File: src/features/mindmap/nodes/database-schema-node.tsx
````typescript
import { Node, NodeProps, Position } from "@xyflow/react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { BaseNode } from "@/components/base-node";
import { LabeledHandle } from "@/features/mindmap/components/labeled-handle";
type DatabaseSchemaNode = Node<{
	label: string;
	schema: { title: string; type: string }[];
}>;
````

## File: src/features/mindmap/nodes/document-node.tsx
````typescript
import { BlurAppear } from "@/components/animated";
import { useMindMap } from "@/contexts";
import { FileIcon } from "lucide-react";
import { useEffect, useState } from "react";
````

## File: src/features/mindmap/nodes/entity-group-node-child.tsx
````typescript
import { memo, useEffect, useState } from 'react'
import { BlurAppear } from '@/components/animated'
import { renderEntity } from '@/features/mindmap/components/cards/render-entity-card'
import { useMindMap } from '@/contexts'
import { Handle, Position } from '@xyflow/react'
interface Photo {
  id: string
  name: string
  mediaType: string
  enablePublicUrl: boolean
  signedUrlTimeout: number
  uploadUrlTimeout: number
  size: number
  version: number
  url: string
}
````

## File: src/features/mindmap/nodes/entity-group-node.tsx
````typescript
import { memo, useEffect, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import { BlurAppear } from '@/components/animated/animated-wrappers'
import { useMindMap } from '@/contexts'
import { renderEntityGroup } from '@/features/mindmap/components/cards/render-entity-card'
⋮----
interface Photo {
  id: string
  name: string
  mediaType: string
  enablePublicUrl: boolean
  signedUrlTimeout: number
  uploadUrlTimeout: number
  size: number
  version: number
  url: string
}
⋮----
````

## File: src/features/mindmap/nodes/group-results-node.tsx
````typescript
import { MyFavoriteStarIllustration } from '@/components/icons'
import {
  CoreNodeBottom,
  CoreNodeContainer,
  CoreNodeContent,
} from '@/features/mindmap/nodes/core-node-ui'
import { useGroupNode } from '@/features/mindmap/hooks/useGroupNode'
import { Handle, Position } from '@xyflow/react'
import { SparklesIcon } from 'lucide-react'
import { useEffect } from 'react'
import type { Node } from '../types'
export const AiButton: React.FC = () =>
interface GroupResultsNodeProps extends Node {
  id: string
  data: {
    type: string
    handles?: string[]
    input: string
    children: Node[]
    label?: string
  }
}
````

## File: src/features/mindmap/nodes/index.tsx
````typescript

````

## File: src/features/mindmap/nodes/personnel-group-node-child.tsx
````typescript
import { memo, useEffect, useState } from 'react'
import { SubjectMatterExpertCard } from '@/features/mindmap/components/cards/subject-matter-expert-card'
import { useMindMap } from '@/contexts'
interface Photo {
  id: string
  name: string
  mediaType: string
  enablePublicUrl: boolean
  signedUrlTimeout: number
  uploadUrlTimeout: number
  size: number
  version: number
  url: string
}
````

## File: src/features/mindmap/nodes/testimony-node.tsx
````typescript
import { memo, useEffect, useState } from 'react'
import { TestimonyCard } from '../components/cards/testimony-card'
import { useMindMap } from '@/contexts'
import { Handle, Position } from '@xyflow/react'
````

## File: src/features/mindmap/store/index.ts
````typescript

````

## File: src/features/mindmap/store/mindmap-store.ts
````typescript
import {
	type Connection,
	type Edge,
	type EdgeChange,
	type Node,
	type NodeChange,
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	getConnectedEdges,
} from "@xyflow/react";
import { create } from "zustand";
export interface MindMapState {
	nodes: Node[];
	edges: Edge[];
	addEdges: (edges: Edge | Edge[]) => void;
	addNodes: (nodes: Node | Node[]) => void;
	onNodesChange: (changes: NodeChange[]) => void;
	onEdgesChange: (changes: EdgeChange[]) => void;
	onConnect: (connection: Connection) => void;
	onNodesDelete: (nodes: Node[]) => void;
	setNodes: (nodes: Node[]) => void;
	setEdges: (edges: Edge[]) => void;
	addNode: (node: Node) => void;
	updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
	deleteNode: (nodeId: string) => void;
	addEdge: (edge: Edge) => void;
	updateEdgeData: (edgeId: string, data: Record<string, unknown>) => void;
}
````

## File: src/features/mindmap/utils/conversions.ts
````typescript
export const convert3dNodeToMindMapNode = (threeDNode: any) =>
export const convertDatabaseRecordToMindMapNode = (record: any) =>
export const convertDatabaseRecordToGraphNode = (
export const formatGraphEdge = (
````

## File: src/features/mindmap/utils/layout-utils.ts
````typescript
import type { Node, XYPosition } from "@xyflow/react";
import {
	BASE_ENTITY_NODE_HEIGHT,
	BASE_ENTITY_NODE_WIDTH,
	CHILD_DIMENSIONS,
	GROUP_NODE_DIMENSIONS,
	PADDING,
	ROOT_NODE_HEIGHT,
	ROOT_NODE_WIDTH,
} from "../config/index.config";
export function calculateDiagonal(width: number, height: number): number
export function calculateCircumcircleRadius(
	width: number,
	height: number,
): number
export function assignPositionsToChildNodes(
	parentNode: Node,
	childNodes: Node[],
): Node[]
export function positionNodesRadially({
	sourceNode,
	nodes,
	radius = 250,
}: {
	sourceNode: Node;
	nodes: Node[];
	radius?: number;
}): Node[]
export function organizeHierarchicalLayout(
	nodes: Node[],
	edges: any[],
	options = {
		nodeWidth: 200,
		nodeHeight: 100,
		horizontalSpacing: 20,
		verticalSpacing: 20,
	},
): Node[]
⋮----
const positionNode = (
		nodeId: string,
		x: number,
		y: number,
		level: number,
): void =>
⋮----
export function createGroupLayout({
	groupId,
	childNodes,
	position,
	dimensions = GROUP_NODE_DIMENSIONS,
	childWidth = BASE_ENTITY_NODE_WIDTH,
	childHeight = BASE_ENTITY_NODE_HEIGHT,
}: {
	groupId: string;
	childNodes: Node[];
	position: XYPosition;
	dimensions?: { width: number; height: number };
	childWidth?: number;
	childHeight?: number;
}):
````

## File: src/features/mindmap/workflows/base-handle.tsx
````typescript
import { cn } from "@/utils";
import { Handle, type HandleProps } from "@xyflow/react";
import React from "react";
⋮----
<Handle ref=
````

## File: src/features/mindmap/workflows/base-node.tsx
````typescript
import { cn } from "@/utils";
import React from "react";
````

## File: src/features/mindmap/workflows/content-creator-routing.ts
````typescript
import type { FlowEdge, FlowNode } from "@/lib/flow/workflow";
````

## File: src/features/mindmap/workflows/developer-tasks-orchestrator.ts
````typescript
import type { FlowEdge, FlowNode } from "@/lib/flow/workflow";
````

## File: src/features/mindmap/workflows/editable-handle.tsx
````typescript
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { BaseHandle } from "@/features/mindmap/workflows/base-handle"
import { cn } from "@/utils"
import type { HandleProps, Node } from "@xyflow/react"
import { useOnSelectionChange } from "@xyflow/react"
import { Edit2, Trash } from "lucide-react"
import React, { useCallback, useState } from "react"
type HandleEditorProps = {
	variant: "edit" | "create"
	label?: string
	description?: string
	onSave: ( newLabel: string, newDescription?: string ) => boolean
	onCancel?: () => void
	align?: "start" | "end"
	children: React.ReactNode
	showDescription?: boolean
}
⋮----
const handleSave = () =>
⋮----
// Trim and validate the label has no spaces
⋮----
const handleCancel = () =>
const reset = () =>
⋮----
const resetEditing = () =>
⋮----
className=
````

## File: src/features/mindmap/workflows/exam-creator-parallelization.ts
````typescript
import type { FlowEdge, FlowNode } from "@/lib/flow/workflow";
````

## File: src/features/mindmap/workflows/labeled-handle.tsx
````typescript
import { cn } from "@/utils"
import type { HandleProps } from "@xyflow/react"
import React from "react"
import { BaseHandle } from "@/features/mindmap/workflows/base-handle"
⋮----
className=
````

## File: src/features/mindmap/workflows/node-factory.ts
````typescript
import type { GenerateTextNodeController } from "@/features/mindmap/workflows/generate-text-node-controller"
import type { PromptCrafterNodeController } from "@/features/mindmap/workflows/prompt-crafter-node-controller"
import type { TextInputNodeController } from "@/features/mindmap/workflows/text-input-node-controller"
import type { VisualizeTextNodeController } from "@/features/mindmap/workflows/visualize-text-node-controller"
import type { FlowNode } from "@/lib/flow/workflow"
import { nanoid } from "nanoid"
export type NodePosition = {
	x: number
	y: number
}
⋮----
export function createNode(
	nodeType: FlowNode["type"],
	position: NodePosition,
): FlowNode
````

## File: src/features/mindmap/workflows/node-header-status.tsx
````typescript
import { cn } from "@/utils";
import { Badge } from "@/components/ui/badge";
export const NodeHeaderStatus = ({
	status,
}: {
	status?: "idle" | "processing" | "success" | "error";
}) =>
````

## File: src/features/mindmap/workflows/node-header.tsx
````typescript
import React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils";
import { Slot } from "@radix-ui/react-slot";
import { EllipsisVertical } from "lucide-react";
export type NodeHeaderProps = React.HTMLAttributes<HTMLElement>;
⋮----
className=
⋮----
<span ref=
⋮----
export type NodeHeaderActionsProps = React.HTMLAttributes<HTMLDivElement>;
⋮----
export interface NodeHeaderActionProps extends ButtonProps {
	label: string;
}
⋮----
export type NodeHeaderMenuActionProps = Omit<
	NodeHeaderActionProps,
	"onClick"
> & {
	trigger?: React.ReactNode;
};
````

## File: src/features/mindmap/workflows/nodes-panel.tsx
````typescript
import { Button } from "@/components/ui/button";
import { Panel } from "@xyflow/react";
import { Eye, PenLine } from "lucide-react";
import type React from "react";
⋮----
export function NodesPanel()
⋮----
const onDragStart = (event: React.DragEvent, nodeType: string) =>
⋮----
onDragStart=
````

## File: src/features/mindmap/workflows/prompt-crafter-node-controller.tsx
````typescript
import { PromptCrafterNode } from "@/features/mindmap/workflows/prompt-crafter-node"
import { useWorkflow } from "@/hooks/flow/use-workflow"
import type { NodeExecutionState } from "@/lib/flow/workflow-execution-engine"
import type { NodeProps } from "@xyflow/react"
import { useCallback } from "react"
import { toast } from "sonner"
export type PromptCrafterNodeController = Omit<PromptCrafterNode, "data"> & {
	type: "prompt-crafter"
	data: Omit<PromptCrafterNode["data"], "status"> & {
		executionState?: NodeExecutionState
	}
}
export function PromptCrafterNodeController( {
	id,
	data,
	...props
}: NodeProps<PromptCrafterNodeController> )
````

## File: src/features/mindmap/workflows/resizable-node.tsx
````typescript
import { BaseNode } from "@/features/mindmap/workflows/base-node"
import { cn } from "@/utils"
import { NodeResizer } from "@xyflow/react"
import React from "react"
⋮----
className=
````

## File: src/features/mindmap/workflows/server-node-processors.ts
````typescript
import type { GenerateTextNode } from "@/features/mindmap/workflows/generate-text-node"
import type { PromptCrafterNode } from "@/features/mindmap/workflows/prompt-crafter-node"
import type { TextInputNode } from "@/features/mindmap/workflows/text-input-node"
import { generateAIText } from "@/lib/flow/generate-ai-text"
import type { FlowNode } from "@/lib/flow/workflow"
import type { NodeProcessor } from "@/lib/flow/workflow-execution-engine"
````

## File: src/features/mindmap/workflows/sse-workflow-execution-engine.ts
````typescript
import type { FlowNode } from "@/lib/flow/workflow";
import type { WorkflowDefinition } from "@/lib/flow/workflow";
import {
	type NodeExecutionState,
	type NodeProcessor,
	createWorkflowExecutionEngine,
} from "@/lib/flow/workflow-execution-engine";
function createEvent(type: string, data: Record<string, unknown>)
function createSSEWorkflowExecutionEngine(
	workflow: WorkflowDefinition,
	nodeProcessor: Record<FlowNode["type"], NodeProcessor>,
	controller: ReadableStreamDefaultController,
)
export async function executeServerWorkflow(
	workflow: WorkflowDefinition,
	nodeProcessor: Record<FlowNode["type"], NodeProcessor>,
	controller: ReadableStreamDefaultController,
)
````

## File: src/features/mindmap/workflows/status-edge-controller.tsx
````typescript
import type { EdgeExecutionState } from "@/lib/flow/workflow-execution-engine";
import { StatusEdge } from "@/components/flow/status-edge";
import type { EdgeProps } from "@xyflow/react";
export type StatusEdgeController = Omit<StatusEdge, "data"> & {
	type: "status";
	data: {
		executionState?: EdgeExecutionState;
	};
};
````

## File: src/features/mindmap/workflows/text-input-node-controller.tsx
````typescript
import { TextInputNode } from "@/features/mindmap/workflows/text-input-node"
import { useWorkflow } from "@/hooks/flow/use-workflow"
import type { NodeExecutionState } from "@/lib/flow/workflow-execution-engine"
import type { NodeProps } from "@xyflow/react"
import { useCallback } from "react"
export type TextInputNodeController = Omit<TextInputNode, "data"> & {
	type: "text-gray-200 dark:text-gray-800"
	data: Omit<TextInputNode["data"], "status"> & {
		executionState?: NodeExecutionState
	}
}
export function TextInputNodeController( {
	id,
	data,
	...props
}: NodeProps<TextInputNodeController> )
````

## File: src/features/mindmap/workflows/text-input-node.tsx
````typescript
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { LabeledHandle } from "@/features/mindmap/workflows/labeled-handle"
import {
	NodeHeader,
	NodeHeaderAction,
	NodeHeaderActions,
	NodeHeaderIcon,
	NodeHeaderTitle,
} from "@/features/mindmap/workflows/node-header"
import { ResizableNode } from "@/features/mindmap/workflows/resizable-node"
import { cn } from "@/utils"
import { type Node, type NodeProps, Position } from "@xyflow/react"
import { PenLine, Trash } from "lucide-react"
export type TextInputData = {
	status: "processing" | "error" | "success" | "idle" | undefined
	config: {
		value: string
	}
}
export type TextInputNode = Node<TextInputData, "text-gray-200 dark:text-gray-800">
export interface TextInputProps extends NodeProps<TextInputNode> {
	onTextChange?: ( value: string ) => void
	onDeleteNode?: () => void
}
⋮----
className=
````

## File: src/features/mindmap/workflows/visualize-text-node-controller.tsx
````typescript
import { VisualizeTextNode } from "@/features/mindmap/workflows/visualize-text-node"
import { useWorkflow } from "@/hooks/flow/use-workflow"
import type { NodeExecutionState } from "@/lib/flow/workflow-execution-engine"
import type { NodeProps } from "@xyflow/react"
import { useCallback } from "react"
export type VisualizeTextNodeController = Omit<VisualizeTextNode, "data"> & {
	type: "visualize-text"
	data: {
		executionState?: NodeExecutionState
	}
}
export function VisualizeTextNodeController( {
	id,
	data,
	...props
}: NodeProps<VisualizeTextNodeController> )
````

## File: src/features/mindmap/workflows/visualize-text-node.tsx
````typescript
import { type Node, type NodeProps, Position } from "@xyflow/react"
import { MarkdownContent } from "@/components/ui/markdown-content"
import { Separator } from "@/components/ui/separator"
import { LabeledHandle } from "@/features/mindmap/workflows/labeled-handle"
import {
	NodeHeader,
	NodeHeaderAction,
	NodeHeaderActions,
	NodeHeaderIcon,
	NodeHeaderTitle,
} from "@/features/mindmap/workflows/node-header"
import { ResizableNode } from "@/features/mindmap/workflows/resizable-node"
import { cn } from "@/utils"
import { Eye, Trash } from "lucide-react"
export type VisualizeTextNode = Node<
	{
		status: "processing" | "error" | "success" | "idle" | undefined
		input: string | undefined
	},
	"visualize-text"
>
interface VisualizeTextProps extends NodeProps<VisualizeTextNode> {
	onDeleteNode?: () => void
}
````

## File: src/features/mindmap/workflows/workflow-execution-engine.ts
````typescript
import type { FlowNode } from "@/lib/flow/workflow";
import type {
	CycleError,
	MissingConnectionError,
	MultipleSourcesError,
	WorkflowDefinition,
} from "@/lib/flow/workflow";
export type ProcessingNodeError = {
	message: string;
	type: "processing-node";
};
export type ProcessedData = Record<string, string> | undefined;
export type NodeProcessor = (
	node: FlowNode,
	targetsData: ProcessedData,
) => Promise<ProcessedData>;
export type NodeExecutionStatus = "success" | "error" | "processing" | "idle";
export type NodeExecutionState = {
	timestamp: string;
	targets?: Record<string, string>;
	sources?: Record<string, string>;
	status: NodeExecutionStatus;
	error?: MissingConnectionError | ProcessingNodeError;
};
export type EdgeExecutionState = {
	error?: MultipleSourcesError | CycleError;
};
interface ExecutionContext {
	workflow: WorkflowDefinition;
	processNode: (
		nodeId: string,
		targetsData: ProcessedData,
	) => Promise<ProcessedData>;
	updateNodeExecutionState: (
		nodeId: string,
		state: Partial<NodeExecutionState>,
	) => void;
}
export const createWorkflowExecutionEngine = (context: ExecutionContext) =>
⋮----
const getNodeTargetsData = (
		workflow: WorkflowDefinition,
		nodeId: string,
): ProcessedData =>
const checkBranchNodeStatus = (nodeId: string): NodeExecutionStatus =>
const getBranchStatus = (
		nodeId: string,
		handleId: string,
): NodeExecutionStatus =>
const canProcessNode = (nodeId: string) =>
const processNode = async (nodeId: string) =>
⋮----
async execute(executionOrder: string[])
````

## File: src/features/mindmap/workflows/workflow.ts
````typescript
import type { GenerateTextNodeController } from "@/features/mindmap/workflows/generate-text-node-controller"
import type { PromptCrafterNodeController } from "@/features/mindmap/workflows/prompt-crafter-node-controller"
import type { StatusEdgeController } from "@/features/mindmap/workflows/status-edge-controller"
import type { TextInputNodeController } from "@/features/mindmap/workflows/text-input-node-controller"
import type { VisualizeTextNodeController } from "@/features/mindmap/workflows/visualize-text-node-controller"
import { nanoid } from "nanoid"
type Dependency = {
	node: string
	sourceHandle: string
}
type Dependencies = Record<string, Dependency[]>
type Dependent = {
	node: string
	targetHandle: string
}
type Dependents = Record<string, Dependent[]>
export type DependencyGraph = {
	dependencies: Map<string, { node: string; sourceHandle: string }[]>
	dependents: Map<string, { node: string; targetHandle: string }[]>
}
export type ConnectionMap = Map<string, FlowEdge[]>
type EdgeErrorInfo = {
	id: string
	source: string
	target: string
	sourceHandle: string
	targetHandle: string
}
export type MultipleSourcesError = {
	message: string
	type: "multiple-sources-for-target-handle"
	edges: EdgeErrorInfo[]
}
export type CycleError = {
	message: string
	type: "cycle"
	edges: EdgeErrorInfo[]
}
type NodeErrorInfo = {
	id: string
	handleId: string
}
export type MissingConnectionError = {
	message: string
	type: "missing-required-connection"
	node: NodeErrorInfo
}
export type WorkflowError =
	| MultipleSourcesError
	| CycleError
	| MissingConnectionError
export interface WorkflowDefinition {
	id: string
	nodes: FlowNode[]
	edges: FlowEdge[]
	executionOrder: string[]
	dependencies: Dependencies
	dependents: Dependents
	errors: WorkflowError[]
}
export type DynamicHandle = {
	id: string
	name: string
	description?: string
}
⋮----
export type FlowNode =
	| VisualizeTextNodeController
	| TextInputNodeController
	| PromptCrafterNodeController
	| GenerateTextNodeController
export type FlowEdge = StatusEdgeController
export function isNodeOfType<T extends FlowNode["type"]>(
	node: FlowNode,
	type: T,
): node is Extract<FlowNode,
export function isNodeWithDynamicHandles<T extends FlowNode>(
function buildDependencyGraph( edges: FlowEdge[] ):
function topologicalSort(
	nodes: FlowNode[],
	dependencies: DependencyGraph["dependencies"],
	dependents: DependencyGraph["dependents"],
): string[]
function validateMultipleSources(
	connectionMap: ConnectionMap,
): MultipleSourcesError[]
function detectCycles(
	nodes: FlowNode[],
	dependencies: DependencyGraph["dependencies"],
	dependents: DependencyGraph["dependents"],
	edges: FlowEdge[],
): CycleError[]
function validateRequiredHandles(
	nodes: FlowNode[],
	edges: FlowEdge[],
): MissingConnectionError[]
export function prepareWorkflow(
	nodes: FlowNode[],
	edges: FlowEdge[],
): WorkflowDefinition
````

## File: src/features/mindmap/index.tsx
````typescript

````

## File: src/features/mindmap/mind-map.tsx
````typescript
import { Graph } from "@/features/mindmap/graph";
import { MindMapProvider } from "@/contexts/mindmap";
import { ReactFlowProvider } from "@xyflow/react";
export const MindMap: React.FC = () =>
````

## File: src/features/mindmap/types.ts
````typescript
import type { CoordinateExtent, NodeOrigin, XYPosition } from "@xyflow/react"
type Position = 'top' | 'bottom' | 'left' | 'right'
interface Handle {
  type: 'source' | 'target'
  position: Position
  x: number
  y: number
  width: number
  height: number
}
interface NodeData {
  label: string
}
interface PositionCoordinates {
  x: number
  y: number
}
export interface xyFlowNode {
  id: string
  type: 'input' | 'output'
  data: NodeData
  position: PositionCoordinates
  size: { width: number; height: number }
  handles: Handle[]
}
export interface xyEdge {
  id: string
  source: xyFlowNode['id']
  target: xyFlowNode['id']
  animated: boolean
}
export type Node<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string = string,
> = {
  id: string
  position: XYPosition
  data: NodeData
  type?: NodeType
  sourcePosition?: Position
  targetPosition?: Position
  hidden?: boolean
  selected?: boolean
  dragging?: boolean
  draggable?: boolean
  selectable?: boolean
  connectable?: boolean
  resizing?: boolean
  deletable?: boolean
  dragHandle?: string
  width?: number | null
  height?: number | null
  parentId?: string
  zIndex?: number
  extent?: 'parent' | CoordinateExtent
  expandParent?: boolean
  ariaLabel?: string
  focusable?: boolean
  style?: React.CSSProperties
  className?: string
  origin?: NodeOrigin
  handles?: NodeHandle[]
  measured?: {
    width?: number
    height?: number
  }
}
````

## File: src/features/r3f/components/canvas/Examples.jsx
````javascript
export const Blob = ({ route = '/', ...props }) => {
const router = useRouter()
const [hovered, hover] = useState(false)
useCursor(hovered)
⋮----
onClick={() => router.push(route)}
onPointerOver={() => hover(true)}
onPointerOut={() => hover(false)}
⋮----
export const Logo = ({ route = '/blob', ...props }) => {
const mesh = useRef(null)
⋮----
const points = useMemo(() => new THREE.EllipseCurve(0, 0, 3, 1.15, 0, 2 * Math.PI, false, 0).getPoints(100), [])
⋮----
useFrame((state, delta) => {
const t = state.clock.getElapsedTime()
mesh.current.rotation.y = Math.sin(t) * (Math.PI / 8)
mesh.current.rotation.x = Math.cos(t) * (Math.PI / 8)
⋮----
<mesh onClick={() => router.push(route)} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)}>
⋮----
export function Duck(props) {
const { scene } = useGLTF('/duck.glb')
useFrame((state, delta) => (scene.rotation.y += delta))
⋮----
export function Dog(props) {
const { scene } = useGLTF('/dog.glb')
````

## File: src/features/r3f/components/canvas/Scene.jsx
````javascript
export default function Scene({ ...props }) {
````

## File: src/features/r3f/components/canvas/View.jsx
````javascript
export const Common = ({ color }) => (
⋮----
const View = forwardRef(({ children, orbit, ...props }, ref) => {
const localRef = useRef(null)
useImperativeHandle(ref, () => localRef.current)
````

## File: src/features/r3f/components/canvas/WebGpuCanvas.tsx
````typescript
import {Canvas, type CanvasProps, extend} from '@react-three/fiber'
⋮----
export const WebGPUCanvas = (props: CanvasProps) =>
⋮----
gl=
````

## File: src/features/r3f/components/dom/Layout.jsx
````javascript
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })
const Layout = ({ children }) => {
const ref = useRef()
````

## File: src/features/r3f/components/post-processing.tsx
````typescript
import {useFrame, useThree} from '@react-three/fiber'
import {useMemo} from 'react'
import {bloom} from 'three/examples/jsm/tsl/display/BloomNode.js'
import {pass} from 'three/tsl'
⋮----
export const PostProcessing = ({
  strength = 1,
  threshold = 1,
}: {
  strength?: number
  threshold?: number
}) =>
````

## File: src/features/r3f/helpers/components/Three.jsx
````javascript
export const Three = ({ children }) => {
````

## File: src/features/r3f/helpers/global.js
````javascript
export const r3f = tunnel()
````

## File: src/features/r3f/templates/hooks/usePostprocess.jsx
````javascript
function getFullscreenTriangle() {
const geometry = new THREE.BufferGeometry()
const vertices = new Float32Array([-1, -1, 3, -1, -1, 3])
const uvs = new Float32Array([0, 0, 2, 0, 0, 2])
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 2))
geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
⋮----
const usePostProcess = () => {
const [{ dpr }, size, gl] = useThree((s) => [s.viewport, s.size, s.gl])
const [screenCamera, screenScene, screen, renderTarget] = useMemo(() => {
let screenScene = new THREE.Scene()
const screenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
const screen = new THREE.Mesh(getFullscreenTriangle())
⋮----
screenScene.add(screen)
const renderTarget = new THREE.WebGLRenderTarget(512, 512, { samples: 4, encoding: gl.encoding })
renderTarget.depthTexture = new THREE.DepthTexture()
screen.material = new THREE.RawShaderMaterial({
⋮----
useEffect(() => {
⋮----
renderTarget.setSize(w, h)
⋮----
useFrame(({ scene, camera, gl }, delta) => {
gl.setRenderTarget(renderTarget)
gl.render(scene, camera)
gl.setRenderTarget(null)
⋮----
gl.render(screenScene, screenCamera)
````

## File: src/features/r3f/templates/Shader/glsl/shader.frag
````
uniform float time;
uniform vec3 color;
varying vec2 vUv;
#pragma glslify: random = require(glsl-random)

void main() {
  gl_FragColor.rgba = vec4(color + sin(time) * 0.2, 1.0);
}
````

## File: src/features/r3f/templates/Shader/glsl/shader.vert
````
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
````

## File: src/features/r3f/templates/Shader/Shader.jsx
````javascript
const ShaderImpl = shaderMaterial(
⋮----
color: new THREE.Color(0.05, 0.0, 0.025),
⋮----
extend({ ShaderImpl })
const Shader = forwardRef(({ children, ...props }, ref) => {
const localRef = useRef()
useImperativeHandle(ref, () => localRef.current)
useFrame((_, delta) => (localRef.current.time += delta))
````

## File: src/features/r3f/templates/Scroll.jsx
````javascript
export default function Scroll({ children }) {
const content = useRef(null)
const wrapper = useRef(null)
useEffect(() => {
const lenis = new Lenis({
⋮----
easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
⋮----
lenis.on('scroll', ({ scroll, progress }) => {
⋮----
const effectSub = addEffect((time) => lenis.raf(time))
⋮----
effectSub()
lenis.destroy()
⋮----
export const ScrollTicker = ({ smooth = 9999999 }) => {
useFrame(({ viewport, camera }, delta) => {
camera.position.y = damp(camera.position.y, -state.progress * viewport.height, smooth, delta)
````

## File: src/features/user/api/save-event.ts
````typescript
import { xata } from '@/db/xata/client'
import path from 'path'
⋮----
const generateJsonFile = async (
  jsonObject: any,
  fileName: string
): Promise<any> =>
export const saveUserMindMap = async (
export interface SaveEventForUserProps {
  userNote: any
  event: any
  theory?: any
  user?: any
}
export const saveEventForUser = async ( {
  userNote,
  event,
  theory,
  user,
}: {
  userNote: { content: string; title: string }
  event: any
  theory: any
  user: any
} ) =>
````

## File: src/features/user/theory/index.tsx
````typescript

````

## File: src/features/user/theory/user-theory-whiteboard.tsx
````typescript
import { Tldraw } from 'tldraw'
⋮----
export default function UserTheoryWhiteBoard()
````

## File: src/features/user/get-user-by-auth-id.tsx
````typescript
import { getXataClient } from '@/db/xata'
⋮----
export const getUserByAuthId = async ( user ) =>
````

## File: src/features/user/index.tsx
````typescript

````

## File: src/hooks/flow/use-workflow.ts
````typescript
import { createNode } from "@/lib/flow/node-factory";
import { SSEWorkflowExecutionClient } from "@/lib/flow/sse-workflow-execution-client";
import {
	type DynamicHandle,
	type FlowEdge,
	type FlowNode,
	type WorkflowDefinition,
	type WorkflowError,
	isNodeOfType,
	isNodeWithDynamicHandles,
	prepareWorkflow,
} from "@/lib/flow/workflow";
import type {
	EdgeExecutionState,
	NodeExecutionState,
} from "@/lib/flow/workflow-execution-engine";
import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import type { Connection, EdgeChange, NodeChange } from "@xyflow/react";
import { nanoid } from "nanoid";
import { createWithEqualityFn } from "zustand/traditional";
export interface WorkflowState {
	nodes: FlowNode[];
	edges: FlowEdge[];
	onNodesChange: (changes: NodeChange<FlowNode>[]) => void;
	onEdgesChange: (changes: EdgeChange<FlowEdge>[]) => void;
	onConnect: (connection: Connection) => void;
	getNodeById: (nodeId: string) => FlowNode;
	createNode: (
		nodeType: FlowNode["type"],
		position: { x: number; y: number },
	) => FlowNode;
	updateNode: <T extends FlowNode["type"]>(
		id: string,
		nodeType: T,
		data: Partial<FlowNode["data"]>,
	) => void;
	updateNodeExecutionState: (
		nodeId: string,
		state: Partial<NodeExecutionState> | undefined,
	) => void;
	updateEdgeExecutionState: (
		edgeId: string,
		state: Partial<EdgeExecutionState> | undefined,
	) => void;
	deleteNode: (id: string) => void;
	addDynamicHandle: <T extends FlowNode["type"]>(
		nodeId: string,
		nodeType: T,
		handleCategory: string,
		handle: Omit<DynamicHandle, "id">,
	) => string;
	removeDynamicHandle: <T extends FlowNode["type"]>(
		nodeId: string,
		nodeType: T,
		handleCategory: string,
		handleId: string,
	) => void;
	validateWorkflow: () => WorkflowDefinition;
	workflowExecutionState: {
		isRunning: boolean;
		finishedAt: string | null;
		errors: WorkflowError[];
		timesRun: number;
	};
	startExecution: () => Promise<{
		status: "success" | "error";
		message: string;
		error?: Error;
		validationErrors?: WorkflowError[];
	}>;
	initializeWorkflow: (nodes: FlowNode[], edges: FlowEdge[]) => void;
}
⋮----
createNode(nodeType, position)
updateNode(id, type, data)
⋮----
deleteNode(id)
addDynamicHandle(nodeId, type, handleCategory, handle)
removeDynamicHandle(nodeId, type, handleCategory, handleId)
async startExecution()
````

## File: src/hooks/geolocation.ts
````typescript
interface GeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}
interface GeolocationState {
  loading: boolean
  accuracy: number | null
  altitude: number | null
  altitudeAccuracy: number | null
  heading: number | null
  latitude: number | null
  longitude: number | null
  speed: number | null
  timestamp: number | null
  error: GeolocationPositionError | null
}
export function useGeolocation(
  options: GeolocationOptions = {}
): GeolocationState
⋮----
const onEvent = (
const onEventError = (error: GeolocationPositionError) =>
````

## File: src/hooks/index.tsx
````typescript

````

## File: src/hooks/intersection-observer.ts
````typescript
interface IntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | Document | null
  rootMargin?: string
}
export function useIntersectionObserver(
  options: IntersectionObserverOptions = {}
): [(node: Element | null) => void, IntersectionObserverEntry | null]
````

## File: src/hooks/use-custom-cursor.ts
````typescript
import { useEffect } from 'react'
export const useCustomCursor = () =>
⋮----
const onMouseMove = ( e: MouseEvent ) =>
const onMouseDown = () =>
const onMouseUp = () =>
const onLinkHover = () =>
const onLinkLeave = () =>
````

## File: src/hooks/use-detect-browser.tsx
````typescript
import { useEffect, useState } from "react";
export const useDetectBrowser = () =>
⋮----
const detectBrowser = () =>
````

## File: src/hooks/use-mobile.ts
````typescript
export function useIsMobile()
⋮----
const onChange = () =>
````

## File: src/hooks/use-mobile.tsx
````typescript
export function useIsMobile()
⋮----
const onChange = () =>
````

## File: src/hooks/use-screen-size.tsx
````typescript
import { useEffect, useState } from "react";
export const useScreenSize = (debounceTime = 250) =>
⋮----
const getDeviceType = (width) =>
⋮----
const handleResize = () =>
````

## File: src/hooks/use-scroll-to-bottom.ts
````typescript
import {
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
export function useScrollToBottom<T extends HTMLElement>(): [
	RefObject<T>,
	boolean,
	() => void,
] {
	const containerRef = useRef<T>(null);
⋮----
const handleScroll = () =>
const handleTouchStart = () =>
const handleTouchEnd = () =>
⋮----
const scrollToBottom = () =>
````

## File: src/hooks/use-sightings-data.ts
````typescript
import { useState, useEffect, useCallback } from "react";
import { getSightingsBatched } from "@/services/sightings/actions/sightings-time-chunk";
import { getEventsBatched } from "@/services/sightings/actions/events-time-chunk";
import type { ValidatedUAPSighting } from "@/services/sightings/uap-sighting";
export interface TimeRange {
	startYear: number;
	endYear: number;
}
export interface FilterOptions {
	shape?: string;
	duration?: number;
	location?: string;
	isSignificantEvent?: boolean;
}
interface UseSightingsDataParams {
	initialTimeRange?: TimeRange;
	chunkSize?: number;
	initialFilters?: FilterOptions;
}
export function useSightingsData({
	initialTimeRange,
	chunkSize = 5,
	initialFilters = {},
}: UseSightingsDataParams =
````

## File: src/hooks/use-textarea-resize.ts
````typescript
import { useLayoutEffect, useRef } from "react";
import type { ComponentProps } from "react";
export function useTextareaResize(
	value: ComponentProps<"textarea">["value"],
	rows = 1,
)
````

## File: src/hooks/useAutoResizeTextArea.tsx
````typescript
import { useCallback, useEffect, useRef } from "react"
interface UseAutoResizeTextareaProps {
  minHeight: number
  maxHeight?: number
}
export function useAutoResizeTextarea( {
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps )
⋮----
const handleResize = ()
````

## File: src/hooks/useClickOutside.tsx
````typescript
import { RefObject, useEffect } from 'react'
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
): void
⋮----
const handleClickOutside = (event: MouseEvent | TouchEvent) =>
````

## File: src/hooks/useContextMenu.tsx
````typescript
import { useLongPress, useMouse } from '@uidotdev/usehooks'
import { useEffect, useRef, useState } from 'react'
interface MenuPosition {
  x: number
  y: number
}
export function useContextMenu()
⋮----
const handlePositionChange = ( x: number, y: number ) =>
const handleContextMenu = ( event: any ) =>
const closeMenu = () =>
````

## File: src/hooks/useMousePosition.tsx
````typescript
import { useState, useEffect, type RefObject } from 'react'
interface MousePosition {
  x: number
  y: number
}
export function useMousePosition()
⋮----
const handleMouseMove = ( event: MouseEvent ) =>
⋮----
export const useFloatingMousePosition = ( containerRef?: RefObject<HTMLElement | SVGElement> ) =>
⋮----
const updatePosition = ( x: number, y: number ) =>
⋮----
const handleTouchMove = ( ev: TouchEvent ) =>
````

## File: src/hooks/useOutsideClick.tsx
````typescript
import React, { useEffect } from 'react'
export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  callback: Function
) =>
⋮----
const listener = (event: any) =>
````

## File: src/hooks/useRemoteImage.ts
````typescript
import { useState, useEffect } from 'react'
export const useRemoteImage = (url: string) =>
⋮----
const getRemoteImage = async (url: string) =>
````

## File: src/hooks/useSSE.tsx
````typescript
import {useEffect, useState, useRef, useCallback} from 'react'
import {fetchRecords} from '@/features/mindmap/actions/xata-to-xyflow'
interface SSEData {
  answer?: string
  records?: string[]
  sessionId?: string
  done?: boolean
  table?: string
  type?: string
}
export const useSSE = (url = '/api/sse/xata/ask') =>
⋮----
// This effect handles the SSE connection
// Add message listener
⋮----
// Return function to remove listener
⋮----
// Only create one connection
⋮----
const fetchRecordData = async () =>
⋮----
// Store the current table for later record fetching
````

## File: src/hooks/useTextSplitter.tsx
````typescript
import { useRef, useEffect, useCallback, useState } from 'react'
import { debounce } from '../utils/debounce'
import SplitType from 'split-type'
export const useTextSplitter = (textElementRef, options: any) =>
⋮----
const handleResize = (entries) =>
const initResizeObserver = () => () =>
````

## File: src/hooks/useTimelineConfig.tsx
````typescript
import { palette } from "@/utils/constants/colors";
import { useState } from "react";
import { create } from "zustand";
import chroma from "chroma-js";
export const useEventsStore = (
const getRandomValueFromArray = (array: any[]) =>
export const useTimelineConfig = (
````

## File: src/hooks/useVisibility.tsx
````typescript
import { useState, useEffect, useRef } from 'react'
export function useVisibility(isScrolling: unknown)
````

## File: src/hooks/useWindowSize.tsx
````typescript
import { useEffect, useState } from "react"
function useWindowSize()
⋮----
const handleResize = () =>
````

## File: src/layouts/explore/key-figures/KeyFiguresGrid.tsx
````typescript
import type { KeyFiguresArray } from "@/app/(site)/explore/key-figures/page";
import { Particles, TextEffect } from "@/components/animated";
import SwipeGrid from "@/components/animated/swipe-grid/SwipeGrid";
import { cn } from "@/utils";
const formatKeyFigures = (keyFigures: KeyFiguresArray) =>
````

## File: src/layouts/historical-events-timeline/event-case-file/EventCaseFileContainer.tsx
````typescript
import { Card } from "@/components/ui/card"
import { Activity, ChevronRight, Circle } from "lucide-react"
import { useEffect, useRef, useState } from "react"
⋮----
const drawInterface = ( ctx: CanvasRenderingContext2D, width: number, height: number ) =>
const animate = () =>
````

## File: src/layouts/historical-events-timeline/geo-spatial-functions.ts
````typescript

````

## File: src/layouts/historical-events-timeline/index.tsx
````typescript

````

## File: src/layouts/historical-events-timeline/sci-fi-globe.tsx
````typescript
import { ICON_BLUE } from '@/utils/constants/colors'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import R3fGlobe from 'r3f-globe'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
⋮----
].reverse()
````

## File: src/layouts/historical-events-timeline/timeline-item.tsx
````typescript
import { TimelineToolTip } from '@/layouts/historical-events-timeline/timeline-tooltip'
import { format } from 'date-fns'
import { useRef } from 'react'
````

## File: src/layouts/historical-events-timeline/timeline-photo-gallery.tsx
````typescript
import { cn } from '@/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
export function extractPhotos( event:
⋮----
const handleItemClick = ( ele: Element ) =>
````

## File: src/layouts/historical-events-timeline/timeline-tooltip.tsx
````typescript
const handleHover = () =>
````

## File: src/layouts/historical-events-timeline/types.ts
````typescript
export type ViewMode = "timeline" | "worldmap" | "journey"
````

## File: src/layouts/historical-events-timeline/VerticalTimeline.tsx
````typescript
import { TextScramble } from '@/components/animated/text-effect/text-scramble/text-scramble'
import { animate, motion } from 'framer-motion'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
⋮----
const createLine = () =>
const updatePath = () =>
````

## File: src/layouts/historical-events-timeline/view-selector.tsx
````typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Globe2, Map } from "lucide-react"
import { type ViewMode } from "./types"
interface ViewSelectorProps {
  value: ViewMode
  onChange: ( value: ViewMode ) => void
}
⋮----
export function ViewSelector(
````

## File: src/layouts/historical-events-timeline/world-map.tsx
````typescript
import { ICON_BLUE } from "@/utils/constants/colors"
import DottedMap from "dotted-map"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"
interface MapProps {
  markers?: Array<{
    start: { lat: number; lng: number; label?: string }
    end: { lat: number; lng: number; label?: string }
  }>
  lineColor?: string
  activeLocation?: any
}
⋮----
const projectPoint = ( lat: number, lng: number ) =>
const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
) =>
⋮----
cx=
cy=
````

## File: src/layouts/home/astronaut/astronaut.tsx
````typescript
import { FunctionComponent, useEffect, useState } from 'react'
import { useMedia } from 'react-use'
import { VFX } from '@vfx-js/core'
⋮----
import Image from 'next/image'
import { BlurFade } from '@/components/animated'
interface AstronautProps { }
export const Astronaut: FunctionComponent<AstronautProps> = () =>
````

## File: src/layouts/home/DoubleHelix.tsx
````typescript
import dynamic from "next/dynamic";
import { useState } from "react";
⋮----
const handleMouseMove = (event: React.MouseEvent) =>
````

## File: src/layouts/home/home.stories.tsx
````typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Suspense } from 'react'
import { Home } from './home'
````

## File: src/layouts/home/index.tsx
````typescript

````

## File: src/layouts/home/LovecraftQuote.tsx
````typescript
import { BlurFade } from '@/components/animated/blur-fade/BlurFade'
import { cn } from '@/utils'
import {
  AnimatePresence,
  motion,
  type TargetAndTransition,
  type Variants,
} from 'framer-motion'
type PresetType = 'blur' | 'shake' | 'scale' | 'fade' | 'slide'
type TextEffectProps = {
  children: string
  per?: 'word' | 'char' | 'line'
  as?: keyof React.JSX.IntrinsicElements
  variants?: {
    container?: Variants
    item?: Variants
  }
  className?: string
  preset?: PresetType
  delay?: number
  trigger?: boolean
  onAnimationComplete?: () => void
  segmentWrapperClassName?: string
}
⋮----
<span className=
````

## File: src/layouts/home/ScanDepthMapHome.tsx
````typescript

````

## File: src/layouts/home/Scene3D.tsx
````typescript
import dynamic from "next/dynamic";
import { forwardRef } from "react";
````

## File: src/layouts/home/SceneRenderer.tsx
````typescript
import {
	OrbitControls,
	PerspectiveCamera,
	useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
⋮----
function Helix(
⋮----
const initializeParticles = () =>
⋮----
interface SceneRendererProps {
	mousePosition: { x: number; y: number };
}
````

## File: src/layouts/home/SiteTitle.tsx
````typescript
import { BlurFade } from '@/components/animated/blur-fade/BlurFade'
import { TextEffect } from '@/components/animated/text-effect'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion-3d'
⋮----
import { useState, useEffect } from 'react'
export function SiteTitle( props: any )
⋮----
delay: i * 0.1, // Delay each letter's animation by 0.05 seconds
````

## File: src/layouts/home/TitleAlt.tsx
````typescript
import React from "react"
import { motion } from "framer-motion"
⋮----
/**
 * For each letter index, determine a small y-offset in either
 * a negative (up) or positive (down) direction for the wave.
 *
 * This is a simple “wave” approach: letters near the center move more
 * than letters near the edges, etc. Tweak as needed.
 */
function getYOffset( index, total, amplitude = 10 )
⋮----
// Center around total/2
⋮----
// Distance from center => bigger amplitude
⋮----
// We’ll invert so center letters move *more*, outer letters move less
// (Feel free to change this approach)
⋮----
// A base variant that handles the overall "pulsing" (opacity + scale).
⋮----
function letterWave( offset )
````

## File: src/services/ai/claude/get-claude-response.ts
````typescript
import { baseResearcherPrompt, researchNetworkMapperPrompt } from '@/services/ai/prompts/researchers.prompt'
import { anthropic } from '@ai-sdk/anthropic'
import { generateText, streamObject, streamText } from 'ai'
export async function getClaudeTextResponse(
export const getClaudeSummary = async (
export const streamClaudeResponse = async (
export const getClaudeVisualization = async (
````

## File: src/services/ai/claude/index.ts
````typescript
import Anthropic from '@anthropic-ai/sdk'
````

## File: src/services/ai/embeddings/embedding.tsx
````typescript
import { openai } from '@ai-sdk/openai'
import { embedMany } from 'ai'
⋮----
const generateChunks = ( input: string ): string[] =>
export const generateEmbeddings = async (
  value: string,
): Promise<Array<
````

## File: src/services/ai/openai/functions/embeddings.ts
````typescript
import { openai } from '@ai-sdk/openai'
import { embed, embedMany } from 'ai'
⋮----
export function cosineSimilarity( vec1: number[], vec2: number[] ): number
const generateChunks = ( input: string ): string[] =>
export const generateEmbeddings = async (
  value: string,
): Promise<Array<
export const generateEmbedding = async ( value: string ): Promise<number[]> =>
````

## File: src/services/ai/openai/functions/generate-resource.ts
````typescript
export const createResource = async ( input: any ) =>
````

## File: src/services/ai/openai/functions/summarize.ts
````typescript
import { DISCLOSURE_ASSISTANT_SYSTEM_PROMPT, SUMMARIZE_PROMPT } from '@/services/ai/prompts/summarize.prompt'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
export const summarize = async ( document: any ) =>
````

## File: src/services/ai/openai/tools/functions.spec.json
````json
{
  "openapi": "3.0.0",
  "name": "search_database",
  "description": "Search a specified table in the Xata (Postgres) database using provided search terms.",
  "strict": false,
  "parameters": {
    "type": "object",
    "properties": {
      "table": {
        "type": "string",
        "description": "The dynamic name of the table to search in the database."
      },
      "search_terms": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "List of search terms to use in the query."
      },
      "search_fields": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "Fields to search within the table. If omitted, all text fields are searched."
      },
      "limit": {
        "type": "integer",
        "description": "Maximum number of records to retrieve.",
        "default": 10
      },
      "sort_by": {
        "type": "string",
        "description": "Field to sort the results by."
      },
      "sort_order": {
        "type": "string",
        "enum": [
          "asc",
          "desc"
        ],
        "description": "Sort order: ascending or descending."
      },
      "date_range": {
        "type": "object",
        "properties": {
          "start_date": {
            "type": "string",
            "format": "date",
            "description": "Start date for the filter."
          },
          "end_date": {
            "type": "string",
            "format": "date",
            "description": "End date for the filter."
          }
        }
      }
    },
    "required": [
      "table",
      "search_terms"
    ]
  }
}
````

## File: src/services/ai/openai/tools/search-database.ts
````typescript
import { executeDatabaseTableQuery } from "@/db/xata/db/search-operations"
export const searchDatabase = async (
````

## File: src/services/ai/openai/config.ts
````typescript

````

## File: src/services/ai/openai/disclosure-agent.ts
````typescript
import { openai } from '@/lib/openai/client'
import { DISCLOSURE_ASSISTANT_ID } from '@/services/ai/openai/config'
import { searchDatabase } from '@/services/ai/openai/tools/search-database'
import { AssistantResponse } from 'ai'
⋮----
export const askDisclosureAgent = async ( input:
````

## File: src/services/ai/openai/helpers.ts
````typescript
export function parseApiResponse(
export const formatRelatedItems = (
  items: {
    type: string
    name: string
    role?: string
    bio?: string
    description?: string
    date?: string
  }[]
) =>
export const filterConnectionsByRelevance = ( connections: any ) =>
export const askHow = ( items: string | any[] )
export const formatSubject = ( items: any[] ) =>
````

## File: src/services/ai/openai/index.ts
````typescript

````

## File: src/services/ai/openai/stream-handler.ts
````typescript
import { openai } from "@/lib/openai/client";
import { searchDatabase } from "@/services/ai/openai/tools/search-database";
import EventEmitter from "events";
import type OpenAI from "openai";
export class AssistantStreamEventHandler extends EventEmitter
⋮----
constructor(client: OpenAI)
async onEvent(event:
async handleFinished(data: any, runId: any, threadId: any)
async handleRequiresAction(data: any, runId: any, threadId: any)
async submitToolOutputs(toolOutputs: any, runId: any, threadId: any)
⋮----
function extractEntities(text: string)
function determineEntityType(entity: string)
````

## File: src/services/ai/prompts/knowledge-graph.prompt.ts
````typescript

````

## File: src/services/ai/prompts/ner-extraction-prompt.ts
````typescript

````

## File: src/services/ai/prompts/structure-the-unstructured.prompt.ts
````typescript

````

## File: src/services/ai/prompts/summarize.prompt.ts
````typescript

````

## File: src/services/ai/prompts/text-to-db-prompt.ts
````typescript

````

## File: src/services/ai/tools/exa/agent.ts
````typescript
import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";
import { exaTools } from "@/lib/tools/exa-ai";
⋮----
export async function POST(req: Request)
````

## File: src/services/ai/tools/exa/exa-ai.ts
````typescript
import { type Tool, tool } from "'ai'"
import { z } from "'zod'"
import Exa from "'exa-js'"
export type ExaTools =
  | "'searchUrls'"
  | "'searchForUrlsContent'"
  | "'searchWikipedia'"
  | "'searchReddit'"
  | "'searchNews'"
export const exaTools = (
  {
    apiKey,
    numResults,
    includeDomains,
    excludeDomains,
    maxCharacters,
  }: {
    apiKey: string
    numResults?: number
    includeDomains?: string[]
    excludeDomains?: string[]
    maxCharacters?: number
  },
  {
    excludeTools,
  }: {
    excludeTools?: ExaTools[]
  }
): Partial<Record<ExaTools, Tool>> =>
async function performExaSearch(
  exa: Exa,
  config: {
    query: string
    numResults?: number
    includeDomains?: string[]
    excludeDomains?: string[]
  }
)
async function exaGetContents(
  exa: Exa,
  config: {
    urls: string[]
    numResults?: number
    includeDomains?: string[]
    excludeDomains?: string[]
    maxCharacters?: number
  }
)
async function exaSearchWikipedia(exa: Exa,
async function exaSearchReddit(exa: Exa,
async function exaSearchNews(exa: Exa,
````

## File: src/services/ai/tools/tavily/agent.ts
````typescript
import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";
import { tavilyTools } from "@/lib/tools/tavily";
⋮----
export async function POST(req: Request)
````

## File: src/services/ai/tools/tavily/tavily.ts
````typescript
import { tool, type Tool } from "'ai'"
import { z } from "'zod'"
import { tavily } from "'@tavily/core'"
type TavilyTools = "'search'" | "'searchContext'" | "'searchQNA'" | "'extract'"
interface TavilyImage {
  url: string
  description?: string
}
interface TavilySearchResult {
  title: string
  url: string
  content: string
  rawContent?: string
  score: number
  publishedDate?: string
}
interface TavilySearchResponse {
  query: string
  answer?: string
  images?: TavilyImage[]
  results: TavilySearchResult[]
  responseTime: number
  error?: string
}
interface TavilyExtractResult {
  url: string
  rawContent: string
  images?: string[]
  error?: string
}
interface TavilyExtractResponse {
  results: TavilyExtractResult[]
  error?: string
}
export const tavilyTools = (
  { apiKey }: { apiKey: string },
  config?: {
    excludeTools?: TavilyTools[]
  }
): Partial<Record<TavilyTools, Tool>> =>
````

## File: src/services/ai/tools/postgres.ts
````typescript
import { type Tool, tool } from "'ai'"
import { z } from "'zod'"
import { Client as PGClient } from "'pg'"
type PGTools = "'getPublicTablesWithColumns'" | "'getExplainForQuery'" | "'runQuery'"
export const postgresTools = (
  { connectionString }: { connectionString: string },
  config?: {
    excludeTools?: PGTools[]
  }
): Partial<Record<PGTools, Tool>> =>
async function getPublicTablesWithColumns(connectionString: string)
async function getExplainForQuery(query: string, connectionString: string)
async function runQuery(query: string, connectionString: string)
````

## File: src/services/ai/workflows/transform-for-reactflow.ts
````typescript
import type { DatabaseSchema } from "@/db/xata/xata";
import type {
	ReactFlowData,
	ReactFlowNode,
	ReactFlowEdge,
} from "@/features/mindmap/actions/xata-to-xyflow";
import type { XataRecord } from "@xata.io/client";
interface RecordObject {
	answer: string;
	records: XataRecord["id"][];
}
interface AskXataResponse {
	answer: RecordObject["answer"];
	relatedRecords: {
		[key: string]: DatabaseSchema[keyof DatabaseSchema] | RecordObject;
	};
}
export async function transformForReactflow(
	xataResult: AskXataResponse,
): Promise<ReactFlowData>
````

## File: src/services/cloudflare/worker.ts
````typescript
import { XataClient } from '@/db/xata'
import type { ExecutionContext } from 'partykit/server'
export interface Env {
  XATA_BRANCH: string
  XATA_API_KEY: string
  XATA_DATABASE_URL: string
}
⋮----
async fetch( request: Request, env: Env, ctx: ExecutionContext ): Promise<Response>
````

## File: src/services/mastra/agents/index.ts
````typescript
import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { weatherTool } from '../tools';
````

## File: src/services/mastra/tools/index.ts
````typescript
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
interface GeocodingResponse {
  results: {
    latitude: number;
    longitude: number;
    name: string;
  }[];
}
interface WeatherResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    weather_code: number;
  };
}
⋮----
const getWeather = async (location: string) =>
function getWeatherCondition(code: number): string
````

## File: src/services/mastra/workflows/index.ts
````typescript
import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Step, Workflow } from '@mastra/core/workflows';
import { z } from 'zod';
⋮----
function getWeatherCondition(code: number): string
````

## File: src/services/mastra/index.ts
````typescript
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { weatherWorkflow } from './workflows';
import { weatherAgent } from './agents';
````

## File: src/services/resource-scrape/jina.ts
````typescript
import axios from "axios"
⋮----
export const scrapeWithJina = async ( url: string ) =>
````

## File: src/services/resource-scrape/multion-ai.ts
````typescript
import { MultiOnClient } from 'multion'
⋮----
const scrapeAndDownloadDocuments = async (
````

## File: src/services/resource-scrape/resource-scrape.ts
````typescript
export const scrapeAndSummarizeAllExternalDisclosureResources = async () =>
````

## File: src/services/sightings/actions/docs.md
````markdown
# Aggregations

Starting with January 10, 2025, this functionality will no longer be part of the Free plan. It will continue to be available as documented to users on the Pro and Enterprises plans. For more details see this blog post.

The /aggregate API allows you to use the search/analytics engine to perform aggregations on your data. Similar to the search API aggregations run in the optional Search store, which means: it is eventually consistent with the main transactional store, and it cannot access the linked fields from a table. The Search store is enabled by default and can be disabled in the Database Settings from the Web UI. The aggregate API and features described in this page require the Search store to be enabled. If these limitations are not acceptable for your use case, you should use the Summarize API. The advantages of using the Aggregation API, over the Summarize API, are:

it generally offers better performance, because the underlying store is column oriented.
it offers composable aggregations that can be combined into complex aggregations / visualizations.
Operations which are available both in the Aggregation and the Summarize API, such as sum, may present small deviations due to differences in the order of reading data from storage and subsequent rounding, as well as in case of in-flight data until consistency is achieved across the different stores.

An example of a relatively complex visualization that can be created with the Aggregation API could be: a multi-line chart, where each line represents a movie genre, and the Y axis represents the average rating of the movies in that genre, per year. This chart can be obtained with a single aggregation request, looking something like this:

```
const results = await xata.db.titles.aggregate({
  movieGenres: {
    topValues: {
      column: 'genre',
      size: 50,
      aggs: {
        byReleaseDate: {
          dateHistogram: {
            column: 'releaseDate',
            calendarInterval: 'year',
            aggs: {
              avgRating: {
                average: {
                  column: 'rating'
                }
              }
            }
          }
        }
      }
    }
  }
});
```

```
const results = await xata.db.titles.aggregate({
  movieGenres: {
    topValues: {
      column: 'genre',
      size: 50,
      aggs: {
        byReleaseDate: {
          dateHistogram: {
            column: 'releaseDate',
            calendarInterval: 'year',
            aggs: {
              avgRating: {
                average: {
                  column: 'rating'
                }
              }
            }
          }
        }
      }
    }
  }
},
{
  "director":"Peter Jackson"
})
```

# Data Analysis Prompts for Geospatial UFO Sighting Data

Based on the data provided, I'll create several analysis prompts that would help an AI geospatial assistant extract meaningful insights from this UFO sighting dataset.

## Spatial Analysis Prompts

1. "Generate a heatmap visualization showing the concentration of UFO sightings across the United States. Identify any notable geographic clusters or hotspots."
2. "Analyze the distribution of UFO sightings in coastal versus inland cities. Is there a statistically significant difference in sighting frequency?"
3. "Compare UFO sighting rates in the top 10 cities with highest counts, adjusting for population density. Which locations have the highest per capita sighting rates?"
4. "Examine the spatial correlation between major airport locations and high-frequency UFO sighting cities. Are sightings more common near air traffic hubs?"
5. "Map the geographic distribution of triangle-shaped UFO sightings versus disk-shaped sightings. Do certain shapes appear more frequently in specific regions?"

## Pattern Analysis Prompts

1. "Analyze whether there's a correlation between UFO shape and geographic location. For example, are 'fireball' sightings more common in desert regions like Arizona and Nevada?"
2. "Identify any regional preferences in UFO shape reporting. Do witnesses in the Pacific Northwest report different shapes than those in the Southeast?"
3. "Determine if there's a correlation between city elevation and specific UFO shapes reported, particularly for 'light' and 'fireball' sightings."
4. "Examine whether cities with high tourism rates (like Las Vegas, Orlando) report different UFO shapes compared to less tourism-focused cities."
5. "Compare sighting frequencies between major metropolitan areas versus smaller cities. Is there a population threshold that correlates with increased sighting reports?"

## Temporal-Spatial Analysis Prompts

1. "Create a time-series analysis of UFO sightings in Las Vegas, Phoenix, and Orlando over the past decade. Identify any seasonal patterns or yearly trends."
2. "Analyze night-time light pollution data against UFO sighting frequencies for the top 30 cities. Do areas with more light pollution report more or fewer sightings?"
3. "Examine the correlation between local weather patterns and UFO sighting reports in the top reporting cities. Are sightings more common during certain weather conditions?"
4. "Map the progression of UFO sighting waves across geographic regions. Do sightings tend to cluster temporally and spatially?"
5. "Analyze whether military base proximity correlates with specific UFO shape reports, particularly 'triangle' and 'chevron' shaped objects."

## Visualization Prompts

1. "Create an interactive map visualization that shows the distribution of different UFO shapes across the United States, with the ability to filter by shape category."
2. "Develop a 3D terrain visualization showing UFO sighting densities overlaid on topographical features to identify any correlation with landscape features."
3. "Generate a comparative dashboard showing the top 5 reported UFO shapes in the 10 cities with highest sighting frequencies."
4. "Create a network analysis visualization showing relationships between neighboring cities with similar UFO shape reporting patterns."
5. "Develop a multi-layer map that overlays UFO sighting data with astronomical events, air traffic patterns, and military training exercise schedules to identify potential correlations."

These prompts should provide a solid foundation for extracting valuable insights from your UFO sighting dataset using a geospatial AI assistant. They cover spatial patterns, temporal trends, and comparative analyses that would be most relevant for understanding the geographic distribution of these phenomena.
````

## File: src/services/sightings/actions/events-time-chunk.ts
````typescript
import { xata } from "@/db/xata/client";
import type { EventsRecord } from "@/db/xata/xata";
interface XataAggregationResult {
	aggs: {
		categoryDistribution?: {
			values: Array<{ $key: string; $count: number }>;
		};
		eventsByYear?: {
			values: Array<{ $key: string; $count: number }>;
		};
	};
}
export async function getEventsByTimeChunk(
	startYear = 1940,
	endYear: number = new Date().getFullYear(),
	limit = 100,
)
export async function getEventsStats(
	startYear = 1940,
	endYear: number = new Date().getFullYear(),
)
export async function getEventsBatched(
	timeRanges: { startYear: number; endYear: number }[],
	limit = 50,
)
````

## File: src/services/sightings/actions/sightings-ai-analysis.ts
````typescript
import { UAPMonitorService } from "@/services/sightings/uap-monitor";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";
export const getFullSightingsPayload = async () =>
type SightingProperty =
	| "city"
	| "state"
	| "country"
	| "location"
	| "shape"
	| "duration_seconds"
	| "duration_hours_min"
	| "description"
	| "reported_date"
	| "video"
	| "image"
	| "date";
export type SightingsAnalysisResult = {
	text: string;
	geographicClusters: GeoCluster[];
	temporalPatterns: TemporalPattern[];
	shapePatterns: ShapePattern[];
	anomalies: Anomaly[];
	correlations: Correlation[];
};
export type GeoCluster = {
	region: string;
	latitude?: number;
	longitude?: number;
	sightingCount: number;
	significance: string;
};
export type TemporalPattern = {
	pattern: string;
	timeframe: string;
	frequency: number;
	description: string;
};
export type ShapePattern = {
	shape: string;
	occurrences: number;
	associatedBehaviors: string[];
	notes?: string;
};
export type Anomaly = {
	description: string;
	location?: string;
	date?: string;
	significance: string;
	confidence: number;
};
export type Correlation = {
	pointOfInterest: string;
	poiType: string;
	sightingCount: number;
	distance: string;
	significance: string;
};
export interface SightingData {
	id: string;
	title?: string;
	content: string;
	location: {
		city?: string;
		state: string;
		coordinates?: {
			lat: number;
			lng: number;
		};
	};
	timestamp: Date;
	shape?: string;
	category?: string[];
	mediaUrls?: string[];
	sourceUrl?: string;
	confidence?: "high" | "medium" | "low";
	type?: "sighting" | "incident" | "news" | "analysis";
}
export interface EventData {
	id: string;
	title?: string;
	name?: string;
	description: string;
	date: Date;
	location?: string;
	latitude?: number;
	longitude?: number;
	category?: string;
}
export const analyzeSightingsData = async (
	sightingsData: SightingData[],
	eventsData: EventData[],
): Promise<
function normalizeDataForAnalysis(
	sightingsData: SightingData[],
	eventsData: EventData[],
): Array<
function prepareCombinedDataSummary(
	normalizedData: Array<{
		id: string;
		type: "sighting" | "event";
		title: string;
		description: string;
		date: Date;
		location: {
			name: string;
			coordinates?: { lat: number; lng: number };
		};
		shape?: string;
		category?: string | string[];
		originalItem: SightingData | EventData;
	}>,
)
````

## File: src/services/sightings/get-events.ts
````typescript
import { xata } from '@/db/xata/client';
export async function getEventsByTimeChunk(
  startYear: number = 1940,
  endYear: number = new Date().getFullYear(),
  limit: number = 100
)
export async function getEventsStats(
  startYear: number = 1940,
  endYear: number = new Date().getFullYear()
)
````

## File: src/services/sightings/get-sightings.ts
````typescript
import { xata } from '@/db/xata/client';
import { ValidatedUAPSighting, UAPSightingSchema } from './uap-sighting';
export async function getSightingsByTimeChunk(
  startYear: number = 1940,
  endYear: number = new Date().getFullYear(),
  limit: number = 100
): Promise<ValidatedUAPSighting[]>
export async function getSightingsStats(
  startYear: number = 1940,
  endYear: number = new Date().getFullYear()
)
````

## File: src/types/xata-extensions.d.ts
````typescript
import { BaseClientOptions, type XataRecord } from "@xata.io/client";
⋮----
interface SummarizeResultItem<T extends XataRecord, S, C extends string[]> {
		[key: string]: unknown;
	}
interface SummarizeResult<T extends XataRecord, S, C extends string[]> {
		summaries?: {
			[K in keyof S]?: Record<string, number> | number;
		};
		[key: string]: unknown;
	}
interface Query<T extends XataRecord, U> {
		summarize<
			S extends Record<string, { count?: string }>,
			C extends string[] = [],
		>(options: {
			filter?: Record<string, unknown>;
			columns?: C;
			summaries?: S;
		}): Promise<SummarizeResult<T, S, C>>;
	}
⋮----
summarize<
			S extends Record<string, { count?: string }>,
			C extends string[] = [],
		>(options: {
			filter?: Record<string, unknown>;
			columns?: C;
			summaries?: S;
		}): Promise<SummarizeResult<T, S, C>>;
````

## File: src/README.md
````markdown
# Source Directory Guidelines

This document outlines the standardized organization, naming conventions, and best practices for the codebase.

## 1. Directory Structure Overview

```
src/
├── app/                 # Next.js App Router directory
│   ├── api/             # API routes
│   └── (routes)/        # Page routes
├── components/          # Reusable UI components
│   ├── ui/              # Basic UI elements
│   ├── forms/           # Form-related components
│   ├── layout/          # Layout components
│   └── feature-specific/ # Components specific to certain features
├── contexts/            # React context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and shared libraries
├── styles/              # Global styles and theming
└── types/               # TypeScript type definitions
```

## 2. Naming Conventions

### Directories

- Use **kebab-case** for all directory names
  - Example: `user-profile/`, `auth-forms/`, `data-visualization/`
- Group related components in descriptive directories
  - Example: `form-elements/`, `navigation/`, `modal-dialogs/`
- Feature-specific directories should clearly indicate their purpose
  - Example: `user-authentication/`, `product-catalog/`

### Files

- Use **PascalCase** for component files
  - Example: `Button.tsx`, `UserProfile.tsx`, `AuthForm.tsx`
- Use **camelCase** for utility files, hooks, and non-component files
  - Example: `useAuth.ts`, `formatDate.ts`, `apiClient.ts`
- Add suffixes to indicate file purpose
  - Example: `Button.test.tsx`, `UserProfile.stories.tsx`, `types.d.ts`

### Components

- Use **PascalCase** for component names
  - Example: `ProductCard`, `NavigationBar`, `UserProfileForm`
- Prefix specialized components when appropriate:
  - UI components with usage context: `Form`, `Table`, `Modal`, etc.
  - HOCs with `with`: `withAuth`, `withTheme`
  - Hooks with `use`: `useWindowSize`, `useFormValidation`

## 3. Component Organization

### File Structure

Each component should follow a consistent structure:

```tsx
// 1. Imports
import { useState } from 'react';
import { SomeComponent } from '@/components/ui';

// 2. Type definitions
type ButtonProps = {
  variant: 'primary' | 'secondary';
  label: string;
  onClick: () => void;
};

// 3. Component definition
export const Button = ({ variant, label, onClick }: ButtonProps) => {
  // Component logic here
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
};

// 4. Subcomponents (if any)
Button.Icon = ({ icon }: { icon: React.ReactNode }) => {
  return <span className="btn-icon">{icon}</span>;
};

// 5. Default exports
export default Button;
```

### Component Folder Structure

For complex components, use a folder-based approach:

```
ButtonGroup/
├── ButtonGroup.tsx        # Main component
├── ButtonGroupItem.tsx    # Child component
├── ButtonGroupContext.tsx # Component-specific context
├── useButtonGroup.ts      # Component-specific hook
├── index.ts               # Export file
└── styles.module.css      # Component-specific styles (if not using Tailwind)
```

## 4. Best Practices

### General Guidelines

- Prefer React Server Components when possible
- Use Client Components only when needed for interactivity
- Minimize use of `'use client'` directive
- Avoid unnecessary state management and re-renders
- Implement proper TypeScript types for all components and functions

### Component Design

- Keep components focused on a single responsibility
- Extract complex logic into custom hooks
- Use composition over inheritance
- Make components reusable and configurable via props
- Consider accessibility from the start (semantic HTML, ARIA attributes)

### Performance Optimization

- Implement code splitting with dynamic imports
- Use `React.memo()` for components that render often but rarely change
- Optimize images using Next.js Image component
- Lazy load components and resources when appropriate

### State Management

- Use React Context for state that needs to be shared across components
- Keep context providers focused and organized by domain
- Consider using libraries like Zustand or Jotai for complex state 
- Implement proper error handling and loading states

### Code Quality

- Write comprehensive tests for components and utility functions
- Document complex logic with clear comments
- Use JSDoc for function and component documentation
- Follow consistent formatting using ESLint and Prettier

By following these conventions and practices, we maintain a clean, consistent, and maintainable codebase that is easy to understand and collaborate on.
````

## File: .cursorignore
````
# Add directories or file patterns to ignore during indexing (e.g. foo/ or *.csv)
````

## File: .mcp.json
````json
{
  "mcpServers": {
    "mcp-installer": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "cursor-mcp-installer-free"
      ],
      "env": {}
    },
    "notion": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@smithery/cli@latest",
        "run",
        "notion-api-mcp",
        "--key",
        "2b2b93c9-23da-473a-b4f0-be3e1c0c8704"
      ],
      "env": {}
    }
  }
}
````

## File: .prettierrc
````
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": false,
  "arrowParens": "always",
  "spaceInParens": false,
  "endOfLine": "lf",
  "jsxSingleQuote": true,
  "jsxBracketSameLine": true,
  "proseWrap": "preserve",
  "htmlWhitespaceSensitivity": "css"
}
````

## File: .xatarc
````
{
  "databaseURL": "https://UltraTerrestrial-kgubvq.us-east-1.xata.sh/db/ultraterrestrial",
  "codegen": {
    "output": "src/db/xata/xata.ts"
  }
}
````

## File: components.json
````json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "gray",
    "cssVariables": false,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "layouts": "@/layouts",
    "providers": "@/providers",
    "utils": "@/utils",
    "ui": "@/components/ui",
    "animated": "@/components/animated",
    "backgrounds": "@/components/backgrounds",
    "services": "@/services",
    "hooks": "@/hooks"
  }
}
````

## File: cursor-tools.config.json
````json
{
  "repo": {
    "provider": "openrouter",
    "model": "google/gemini-2.5-pro-exp-03-25:free"
  },
  "doc": {
    "provider": "openrouter",
    "model": "anthropic/claude-3.7-sonnet",
    "maxTokens": 4096
  },
  "web": {
    "provider": "gemini",
    "model": "gemini-2.5-pro-exp"
  },
  "plan": {
    "fileProvider": "gemini",
    "thinkingProvider": "perplexity",
    "thinkingModel": "r1-1776"
  },
  "browser": {
    "headless": false
  },
  "stagehand": {
    "model": "claude-3-7-sonnet-latest",
    "provider": "anthropic",
    "timeout": 90000
  },
  "openai": {
    "model": "o3-mini"
  }
}
````

## File: erd-diagram.mermaid
````
erDiagram
    Personnel ||--o{ OrganizationMembers : has
    Organizations ||--o{ OrganizationMembers : contains
    Personnel ||--o{ Testimonies : provides
    Events ||--o{ Testimonies : has
    Testimonies ||--o{ Artifacts : contains
    Personnel ||--o{ Documents : owns
    Documents }o--|| Organizations : references
    Personnel ||--o{ Theories : creates
    Theories }o--|| Topics : about
    
    Events ||--o{ EventTopicExperts : has
    Topics ||--o{ EventTopicExperts : provides
    EventTopicExperts }o--|| Personnel : involves
    
    Events }o--|| Locations : occurs_at
    
    Sightings }o--|| Locations : occurs_at
    Sightings }o--|| Personnel : "witnessed by"
    
    Topics ||--o{ TopicExperts : has
    Personnel ||--o{ TopicExperts : is
    
    Topics ||--o{ TopicsTestimonies : has
    TopicsTestimonies }o--|| Testimonies : references
    
    Artifacts }o--|| Locations : found_at
    Artifacts ||--o{ Theories : supports
    
    CaseFiles }o--|| Events : documents
    CaseFiles }o--|| Documents : contains
    CaseFiles ||--o{ Testimonies : includes
    CaseFiles }o--|| Personnel : "managed by"
````

## File: global.d.ts
````typescript

````

## File: liveblocks.config.ts
````typescript
interface Liveblocks {
    Presence: {
    };
    Storage: {
    };
    UserMeta: {
      id: string;
      info: {
      };
    };
    RoomEvent: {};
    ThreadMetadata: {
    };
    RoomInfo: {
    };
  }
````

## File: README-task-master.md
````markdown
# Task Master
### by [@eyaltoledano](https://x.com/eyaltoledano)

A task management system for AI-driven development with Claude, designed to work seamlessly with Cursor AI.

## Requirements

- Node.js 14.0.0 or higher
- Anthropic API key (Claude API)
- Anthropic SDK version 0.39.0 or higher
- OpenAI SDK (for Perplexity API integration, optional)

## Configuration

The script can be configured through environment variables in a `.env` file at the root of the project:

### Required Configuration
- `ANTHROPIC_API_KEY`: Your Anthropic API key for Claude

### Optional Configuration
- `MODEL`: Specify which Claude model to use (default: "claude-3-7-sonnet-20250219")
- `MAX_TOKENS`: Maximum tokens for model responses (default: 4000)
- `TEMPERATURE`: Temperature for model responses (default: 0.7)
- `PERPLEXITY_API_KEY`: Your Perplexity API key for research-backed subtask generation
- `PERPLEXITY_MODEL`: Specify which Perplexity model to use (default: "sonar-medium-online")
- `DEBUG`: Enable debug logging (default: false)
- `LOG_LEVEL`: Log level - debug, info, warn, error (default: info)
- `DEFAULT_SUBTASKS`: Default number of subtasks when expanding (default: 3)
- `DEFAULT_PRIORITY`: Default priority for generated tasks (default: medium)
- `PROJECT_NAME`: Override default project name in tasks.json
- `PROJECT_VERSION`: Override default version in tasks.json

## Installation

```bash
# Install globally
npm install -g task-master-ai

# OR install locally within your project
npm install task-master-ai
```

### Initialize a new project

```bash
# If installed globally
task-master init

# If installed locally
npx task-master-init
```

This will prompt you for project details and set up a new project with the necessary files and structure.

### Important Notes

1. This package uses ES modules. Your package.json should include `"type": "module"`.
2. The Anthropic SDK version should be 0.39.0 or higher.

## Quick Start with Global Commands

After installing the package globally, you can use these CLI commands from any directory:

```bash
# Initialize a new project
task-master init

# Parse a PRD and generate tasks
task-master parse-prd your-prd.txt

# List all tasks
task-master list

# Show the next task to work on
task-master next

# Generate task files
task-master generate
```

## Troubleshooting

### If `task-master init` doesn't respond:

Try running it with Node directly:

```bash
node node_modules/claude-task-master/scripts/init.js
```

Or clone the repository and run:

```bash
git clone https://github.com/eyaltoledano/claude-task-master.git
cd claude-task-master
node scripts/init.js
```

## Task Structure

Tasks in tasks.json have the following structure:

- `id`: Unique identifier for the task (Example: `1`)
- `title`: Brief, descriptive title of the task (Example: `"Initialize Repo"`)
- `description`: Concise description of what the task involves (Example: `"Create a new repository, set up initial structure."`)
- `status`: Current state of the task (Example: `"pending"`, `"done"`, `"deferred"`)
- `dependencies`: IDs of tasks that must be completed before this task (Example: `[1, 2]`)
  - Dependencies are displayed with status indicators (✅ for completed, ⏱️ for pending)
  - This helps quickly identify which prerequisite tasks are blocking work
- `priority`: Importance level of the task (Example: `"high"`, `"medium"`, `"low"`)
- `details`: In-depth implementation instructions (Example: `"Use GitHub client ID/secret, handle callback, set session token."`)
- `testStrategy`: Verification approach (Example: `"Deploy and call endpoint to confirm 'Hello World' response."`)
- `subtasks`: List of smaller, more specific tasks that make up the main task (Example: `[{"id": 1, "title": "Configure OAuth", ...}]`)

## Integrating with Cursor AI

Claude Task Master is designed to work seamlessly with [Cursor AI](https://www.cursor.so/), providing a structured workflow for AI-driven development.

### Setup with Cursor

1. After initializing your project, open it in Cursor
2. The `.cursor/rules/dev_workflow.mdc` file is automatically loaded by Cursor, providing the AI with knowledge about the task management system
3. Place your PRD document in the `scripts/` directory (e.g., `scripts/prd.txt`)
4. Open Cursor's AI chat and switch to Agent mode

### Initial Task Generation

In Cursor's AI chat, instruct the agent to generate tasks from your PRD:

```
Please use the task-master parse-prd command to generate tasks from my PRD. The PRD is located at scripts/prd.txt.
```

The agent will execute:
```bash
task-master parse-prd scripts/prd.txt
```

This will:
- Parse your PRD document
- Generate a structured `tasks.json` file with tasks, dependencies, priorities, and test strategies
- The agent will understand this process due to the Cursor rules

### Generate Individual Task Files

Next, ask the agent to generate individual task files:

```
Please generate individual task files from tasks.json
```

The agent will execute:
```bash
task-master generate
```

This creates individual task files in the `tasks/` directory (e.g., `task_001.txt`, `task_002.txt`), making it easier to reference specific tasks.

## AI-Driven Development Workflow

The Cursor agent is pre-configured (via the rules file) to follow this workflow:

### 1. Task Discovery and Selection

Ask the agent to list available tasks:

```
What tasks are available to work on next?
```

The agent will:
- Run `task-master list` to see all tasks
- Run `task-master next` to determine the next task to work on
- Analyze dependencies to determine which tasks are ready to be worked on
- Prioritize tasks based on priority level and ID order
- Suggest the next task(s) to implement

### 2. Task Implementation

When implementing a task, the agent will:
- Reference the task's details section for implementation specifics
- Consider dependencies on previous tasks
- Follow the project's coding standards
- Create appropriate tests based on the task's testStrategy

You can ask:
```
Let's implement task 3. What does it involve?
```

### 3. Task Verification

Before marking a task as complete, verify it according to:
- The task's specified testStrategy
- Any automated tests in the codebase
- Manual verification if required

### 4. Task Completion

When a task is completed, tell the agent:

```
Task 3 is now complete. Please update its status.
```

The agent will execute:
```bash
task-master set-status --id=3 --status=done
```

### 5. Handling Implementation Drift

If during implementation, you discover that:
- The current approach differs significantly from what was planned
- Future tasks need to be modified due to current implementation choices
- New dependencies or requirements have emerged

Tell the agent:
```
We've changed our approach. We're now using Express instead of Fastify. Please update all future tasks to reflect this change.
```

The agent will execute:
```bash
task-master update --from=4 --prompt="Now we are using Express instead of Fastify."
```

This will rewrite or re-scope subsequent tasks in tasks.json while preserving completed work.

### 6. Breaking Down Complex Tasks

For complex tasks that need more granularity:

```
Task 5 seems complex. Can you break it down into subtasks?
```

The agent will execute:
```bash
task-master expand --id=5 --num=3
```

You can provide additional context:
```
Please break down task 5 with a focus on security considerations.
```

The agent will execute:
```bash
task-master expand --id=5 --prompt="Focus on security aspects"
```

You can also expand all pending tasks:
```
Please break down all pending tasks into subtasks.
```

The agent will execute:
```bash
task-master expand --all
```

For research-backed subtask generation using Perplexity AI:
```
Please break down task 5 using research-backed generation.
```

The agent will execute:
```bash
task-master expand --id=5 --research
```

## Command Reference

Here's a comprehensive reference of all available commands:

### Parse PRD
```bash
# Parse a PRD file and generate tasks
task-master parse-prd <prd-file.txt>

# Limit the number of tasks generated
task-master parse-prd <prd-file.txt> --num-tasks=10
```

### List Tasks
```bash
# List all tasks
task-master list

# List tasks with a specific status
task-master list --status=<status>

# List tasks with subtasks
task-master list --with-subtasks

# List tasks with a specific status and include subtasks
task-master list --status=<status> --with-subtasks
```

### Show Next Task
```bash
# Show the next task to work on based on dependencies and status
task-master next
```

### Show Specific Task
```bash
# Show details of a specific task
task-master show <id>
# or
task-master show --id=<id>

# View a specific subtask (e.g., subtask 2 of task 1)
task-master show 1.2
```

### Update Tasks
```bash
# Update tasks from a specific ID and provide context
task-master update --from=<id> --prompt="<prompt>"
```

### Generate Task Files
```bash
# Generate individual task files from tasks.json
task-master generate
```

### Set Task Status
```bash
# Set status of a single task
task-master set-status --id=<id> --status=<status>

# Set status for multiple tasks
task-master set-status --id=1,2,3 --status=<status>

# Set status for subtasks
task-master set-status --id=1.1,1.2 --status=<status>
```

When marking a task as "done", all of its subtasks will automatically be marked as "done" as well.

### Expand Tasks
```bash
# Expand a specific task with subtasks
task-master expand --id=<id> --num=<number>

# Expand with additional context
task-master expand --id=<id> --prompt="<context>"

# Expand all pending tasks
task-master expand --all

# Force regeneration of subtasks for tasks that already have them
task-master expand --all --force

# Research-backed subtask generation for a specific task
task-master expand --id=<id> --research

# Research-backed generation for all tasks
task-master expand --all --research
```

### Clear Subtasks
```bash
# Clear subtasks from a specific task
task-master clear-subtasks --id=<id>

# Clear subtasks from multiple tasks
task-master clear-subtasks --id=1,2,3

# Clear subtasks from all tasks
task-master clear-subtasks --all
```

### Analyze Task Complexity
```bash
# Analyze complexity of all tasks
task-master analyze-complexity

# Save report to a custom location
task-master analyze-complexity --output=my-report.json

# Use a specific LLM model
task-master analyze-complexity --model=claude-3-opus-20240229

# Set a custom complexity threshold (1-10)
task-master analyze-complexity --threshold=6

# Use an alternative tasks file
task-master analyze-complexity --file=custom-tasks.json

# Use Perplexity AI for research-backed complexity analysis
task-master analyze-complexity --research
```

### View Complexity Report
```bash
# Display the task complexity analysis report
task-master complexity-report

# View a report at a custom location
task-master complexity-report --file=my-report.json
```

### Managing Task Dependencies
```bash
# Add a dependency to a task
task-master add-dependency --id=<id> --depends-on=<id>

# Remove a dependency from a task
task-master remove-dependency --id=<id> --depends-on=<id>

# Validate dependencies without fixing them
task-master validate-dependencies

# Find and fix invalid dependencies automatically
task-master fix-dependencies
```

### Add a New Task
```bash
# Add a new task using AI
task-master add-task --prompt="Description of the new task"

# Add a task with dependencies
task-master add-task --prompt="Description" --dependencies=1,2,3

# Add a task with priority
task-master add-task --prompt="Description" --priority=high
```

## Feature Details

### Analyzing Task Complexity

The `analyze-complexity` command:
- Analyzes each task using AI to assess its complexity on a scale of 1-10
- Recommends optimal number of subtasks based on configured DEFAULT_SUBTASKS
- Generates tailored prompts for expanding each task
- Creates a comprehensive JSON report with ready-to-use commands
- Saves the report to scripts/task-complexity-report.json by default

The generated report contains:
- Complexity analysis for each task (scored 1-10)
- Recommended number of subtasks based on complexity
- AI-generated expansion prompts customized for each task
- Ready-to-run expansion commands directly within each task analysis

### Viewing Complexity Report

The `complexity-report` command:
- Displays a formatted, easy-to-read version of the complexity analysis report
- Shows tasks organized by complexity score (highest to lowest)
- Provides complexity distribution statistics (low, medium, high)
- Highlights tasks recommended for expansion based on threshold score
- Includes ready-to-use expansion commands for each complex task
- If no report exists, offers to generate one on the spot

### Smart Task Expansion

The `expand` command automatically checks for and uses the complexity report:

When a complexity report exists:
- Tasks are automatically expanded using the recommended subtask count and prompts
- When expanding all tasks, they're processed in order of complexity (highest first)
- Research-backed generation is preserved from the complexity analysis
- You can still override recommendations with explicit command-line options

Example workflow:
```bash
# Generate the complexity analysis report with research capabilities
task-master analyze-complexity --research

# Review the report in a readable format
task-master complexity-report

# Expand tasks using the optimized recommendations
task-master expand --id=8
# or expand all tasks
task-master expand --all
```

### Finding the Next Task

The `next` command:
- Identifies tasks that are pending/in-progress and have all dependencies satisfied
- Prioritizes tasks by priority level, dependency count, and task ID
- Displays comprehensive information about the selected task:
  - Basic task details (ID, title, priority, dependencies)
  - Implementation details
  - Subtasks (if they exist)
- Provides contextual suggested actions:
  - Command to mark the task as in-progress
  - Command to mark the task as done
  - Commands for working with subtasks

### Viewing Specific Task Details

The `show` command:
- Displays comprehensive details about a specific task or subtask
- Shows task status, priority, dependencies, and detailed implementation notes
- For parent tasks, displays all subtasks and their status
- For subtasks, shows parent task relationship
- Provides contextual action suggestions based on the task's state
- Works with both regular tasks and subtasks (using the format taskId.subtaskId)

## Best Practices for AI-Driven Development

1. **Start with a detailed PRD**: The more detailed your PRD, the better the generated tasks will be.

2. **Review generated tasks**: After parsing the PRD, review the tasks to ensure they make sense and have appropriate dependencies.

3. **Analyze task complexity**: Use the complexity analysis feature to identify which tasks should be broken down further.

4. **Follow the dependency chain**: Always respect task dependencies - the Cursor agent will help with this.

5. **Update as you go**: If your implementation diverges from the plan, use the update command to keep future tasks aligned with your current approach.

6. **Break down complex tasks**: Use the expand command to break down complex tasks into manageable subtasks.

7. **Regenerate task files**: After any updates to tasks.json, regenerate the task files to keep them in sync.

8. **Communicate context to the agent**: When asking the Cursor agent to help with a task, provide context about what you're trying to achieve.

9. **Validate dependencies**: Periodically run the validate-dependencies command to check for invalid or circular dependencies.

## Example Cursor AI Interactions

### Starting a new project
```
I've just initialized a new project with Claude Task Master. I have a PRD at scripts/prd.txt. 
Can you help me parse it and set up the initial tasks?
```

### Working on tasks
```
What's the next task I should work on? Please consider dependencies and priorities.
```

### Implementing a specific task
```
I'd like to implement task 4. Can you help me understand what needs to be done and how to approach it?
```

### Managing subtasks
```
I need to regenerate the subtasks for task 3 with a different approach. Can you help me clear and regenerate them?
```

### Handling changes
```
We've decided to use MongoDB instead of PostgreSQL. Can you update all future tasks to reflect this change?
```

### Completing work
```
I've finished implementing the authentication system described in task 2. All tests are passing. 
Please mark it as complete and tell me what I should work on next.
```

### Analyzing complexity
```
Can you analyze the complexity of our tasks to help me understand which ones need to be broken down further?
```

### Viewing complexity report
```
Can you show me the complexity report in a more readable format?
```
````

## File: shader.d.ts
````typescript

````

## File: vercel.json
````json
{
  "crons": [
    {
      "path": "/api/cron/update-rankings",
      "schedule": "0 2 * * *"
    }
  ]
}
````

## File: src/app/(site)/explore/visualizations/3d-grid/page.tsx
````typescript
import {ThreeDGrid} from '@/features/3d/visualizations/3d-grid/3d-grid'
import {getXataClient} from '@/db/xata'
import {Suspense} from 'react'
⋮----
export default async function Index()
````

## File: src/app/(site)/explore/visualizations/drawing-board/page.tsx
````typescript
import {D3DrawingBoard} from '@/features/3d/drawing-board'
import {
  type NetworkGraphPayload,
  getEntityNetworkGraphData,
} from '@/features/mindmap/actions/get-entity-network-graph-data'
import {Suspense} from 'react'
export default async function Index()
````

## File: src/app/(site)/explore/visualizations/word-cloud/page.tsx
````typescript
import {getXataClient} from '@/db/xata'
⋮----
import dynamic from 'next/dynamic'
import {Suspense} from 'react'
⋮----
import {computeWordRefsWithPosition} from '@/utils/functions'
⋮----
const formatConnections = (connectionsArray: any) =>
````

## File: src/app/(site)/explore/page.tsx
````typescript
import {EntityNetworkGraph3D} from '@/features/3d/entity-network-graph-3d'
import {
  type NetworkGraphPayload,
  getEntityNetworkGraphData,
} from '@/features/mindmap/actions/get-entity-network-graph-data'
import {Suspense} from 'react'
export default async function Index()
````

## File: src/app/(site)/history/events/page.tsx
````typescript
import { ThreeDTimelineJourney } from '@/features/3d/3d-timeline-journey'
import { getXataClient } from '@/db/xata'
import { Suspense } from 'react'
⋮----
export default async function Index()
⋮----
const removeEmptyKeys = ( obj: any ) =>
function removeLeadingZero( input )
````

## File: src/app/(site)/history/gallery/page.tsx
````typescript
import {SpatialGallery} from '@/features/3d/visualizations/spatial-gallery'
import {getXataClient} from '@/db/xata'
import {transformImage} from '@xata.io/client'
⋮----
function generatePositions(totalItems: [any])
````

## File: src/app/(site)/history/page.tsx
````typescript
import { ScrollThrough3D } from '@/features/3d/scroll-through-3d'
import { getXataClient } from '@/db/xata'
⋮----
export default async function Index()
⋮----
const removeEmptyKeys = ( obj: any ) =>
function removeLeadingZero( input )
````

## File: src/app/(site)/sightings/sightings-analytics.tsx
````typescript
import type React from 'react'
import {useRef, useState, useEffect} from 'react'
import {Button} from '@/components/ui/button'
import {Card, CardContent} from '@/components/ui/card'
import SightingsAIInsights from '@/components/sightings/sightings-ai-insights'
import {AlertCircle, Sparkles} from 'lucide-react'
import type {SightingsAnalysisResult} from '@/services/sightings/actions/sightings-ai-analysis''
interface SightingsAnalyticsProps {
  sightingsData: any[]
  analyzeSightingsData: (sightingsData: any[]) => Promise<{
    analysis: SightingsAnalysisResult
    streamingValue: any
  }>
}
⋮----
const handleAnalyzeClick = async () =>
⋮----
const animateTerminalText = () =>
const setTerminalLineRef = (el: HTMLDivElement | null, index: number) =>
````

## File: src/app/api/disclosure/chat/demo.ts
````typescript
import { transformForReactflow } from "@/services/ai/workflows/transform-for-reactflow";
import { AssistantResponse, type DataMessage } from "ai";
import OpenAI from "openai";
const askXataWithAi = async ({
	table,
	question,
}:
⋮----
// Assistant ID (replace with your actual ID)
⋮----
// Sample NER extraction prompt
⋮----
// Define types for our multi-step workflow
interface XataRecord {
	id?: string;
	name?: string;
	title?: string;
	[key: string]: unknown;
}
interface RecordObject {
	answer: string;
	record: XataRecord | null;
}
interface XataResult {
	relatedRecords: {
		personnel?: RecordObject;
		events?: RecordObject;
		testimonies?: RecordObject;
		[key: string]: RecordObject | undefined;
	};
}
interface ReactFlowNode {
	id: string;
	type: string;
	position: { x: number; y: number };
	data: {
		label: string;
		[key: string]: unknown;
	};
}
interface ReactFlowEdge {
	id: string;
	source: string;
	target: string;
	type: string;
	animated: boolean;
	label?: string;
}
interface ReactFlowData {
	nodes: ReactFlowNode[];
	edges: ReactFlowEdge[];
}
// Custom progress update interface
interface CustomDataMessage extends DataMessage {
	status?: string;
	message?: string;
	step?: string;
	progress?: number;
}
export async function POST(req: Request)
⋮----
// If no threadId, create one with file_search tool resources enabled
````

## File: src/app/api/disclosure/data-layer/scrape/route.ts
````typescript
import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  scrapeWithFireCrawl,
  deepResearch,
  ResearchCategory,
  ResearchDepth
} from '@/services/resource-scrape'
import { processResource, processMultipleResources } from '@/services/knowledge-layer/process-resource'
⋮----
export async function POST(request: Request)
export async function GET(request: Request)
````

## File: src/app/api/disclosure/data-layer/sightings/route.ts
````typescript
import fs from "node:fs";
import path from "node:path";
export async function GET(request: any)
````

## File: src/app/api/internal/uap-sightings/route.ts
````typescript
import { type NextRequest } from 'next/server'
import { getSightingsByTimeChunk, getSightingsStats } from '@/services/sightings/get-sightings'
export async function GET(request: NextRequest)
````

## File: src/components/cult-ui/sortable-list/SortableList.tsx
````typescript
import { Button } from '@/components/ui/button'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import {
  AnimatePresence,
  LayoutGroup,
  Reorder,
  motion,
  useDragControls,
} from 'framer-motion'
import { Plus, RepeatIcon, Trash } from 'lucide-react'
import useMeasure from 'react-use-measure'
import { cn } from '@/utils'
import { Checkbox } from '@/components/ui/checkbox'
export type Item = {
  text: string
  checked: boolean
  id: number
  description: string
}
interface SortableListItemProps {
  item: Item
  order: number
  onCompleteItem: ( id: number ) => void
  onRemoveItem: ( id: number ) => void
  renderExtra?: ( item: Item ) => React.ReactNode
  isExpanded?: boolean
  className?: string
  handleDrag: () => void
}
⋮----
const handleDragStart = ( event: any ) =>
const handleDragEnd = () =>
⋮----
<motion.div className=
````

## File: src/components/globes/cobe-globes/admin-dashboard-globe.tsx
````typescript
import createGlobe from 'cobe'
import { useEffect, useRef } from 'react'
export type GlobeLocation = {
  location: [number, number]
  size: number
}
⋮----
const locationToAngles = (lat, long) =>
````

## File: src/components/globes/mapbox-globe.tsx
````typescript
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Map, NavigationControl, useControl } from 'react-map-gl'
import { GeoJsonLayer, ArcLayer } from 'deck.gl'
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox'
⋮----
function DeckGLOverlay(props)
function Root()
⋮----
const onClick = (info) =>
````

## File: src/components/globes/threejs-globe.tsx
````typescript
import {OrbitControls} from '@react-three/drei'
import {Canvas, extend, type Object3DNode, useThree} from '@react-three/fiber'
import {memo, useCallback, useEffect, useRef, useState} from 'react'
import {Color, Fog, PerspectiveCamera, Scene, Vector3} from 'three'
import ThreeGlobe from 'three-globe'
import countries from './countries.json'
⋮----
interface ThreeElements {
    threeGlobe: Object3DNode<ThreeGlobe, typeof ThreeGlobe>
  }
⋮----
type Position = {
  order: number
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  arcAlt: number
  color: string
}
export type GlobeConfig = {
  pointSize?: number
  globeColor?: string
  showAtmosphere?: boolean
  atmosphereColor?: string
  atmosphereAltitude?: number
  emissive?: string
  emissiveIntensity?: number
  shininess?: number
  polygonColor?: string
  ambientLight?: string
  directionalLeftLight?: string
  directionalTopLight?: string
  pointLight?: string
  arcTime?: number
  arcLength?: number
  rings?: number
  maxRings?: number
  initialPosition?: {
    lat: number
    lng: number
  }
  autoRotate?: boolean
  autoRotateSpeed?: number
}
interface WorldProps {
  globeConfig: GlobeConfig
  data: Position[]
}
⋮----
export function Globe(
⋮----
const _buildMaterial = () =>
const _buildData = () =>
⋮----
export function WebGLRendererConfig()
⋮----
function random(min: number, max: number, count: number)
````

## File: src/components/hud-interface/CardsPlayerHolo2.tsx
````typescript
import {useEffect, useRef, useState} from 'react'
interface CardData {
  id: number
  image: string
  thumbnail: string
  artist: string
  genre: string
  duration: number
}
interface CardsPlayerHolo2Props {
  className?: string
  cardData?: CardData[]
  variant?: 'horizontal' | 'vertical'
}
⋮----
const formatTime = (seconds: number) =>
const updateCards = (animate = true) =>
const navigatePrev = () =>
const navigateNext = () =>
const togglePlay = () =>
const animateStaticVisualizer = () =>
const toggleVisualizer = () =>
const updateProgress = () =>
const seekTrack = (e: React.MouseEvent<HTMLDivElement>) =>
const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) =>
const handleDrag = (e: React.MouseEvent<HTMLDivElement>) =>
const handleDragEnd = () =>
⋮----
const handleMouseMove = (e: MouseEvent) =>
const handleMouseUp = () =>
⋮----
const handleResize = () =>
````

## File: src/components/hud-interface/HudDash.animations.tsx
````typescript
interface CanvasRefs {
  torusCanvas: HTMLCanvasElement | null
  frequencyCanvas: HTMLCanvasElement | null
  amplitudeCurveCanvas: HTMLCanvasElement | null
  dynamicsCanvas: HTMLCanvasElement | null
  meshCanvas: HTMLCanvasElement | null
  trackingCanvas: HTMLCanvasElement | null
}
interface ShapeRefs {
  shape1: SVGSVGElement | null
  shape2: SVGSVGElement | null
  shape3: SVGSVGElement | null
  shape4: SVGSVGElement | null
}
interface CleanupHandles {
  intervals: number[]
  animationFrames: number[]
}
export function initAnimations(
  canvasRefs: CanvasRefs,
  shapeRefs: ShapeRefs,
  progressBlocks: HTMLDivElement | null,
  dotMatrix: HTMLDivElement | null
): CleanupHandles
function initShapeAnimations(shapeRefs: ShapeRefs, intervals: number[])
function initTorusAnimation(canvas: HTMLCanvasElement | null, animationFrames: number[])
⋮----
function resizeCanvas()
⋮----
function drawTorus()
⋮----
function initFrequencyAnimation(canvas: HTMLCanvasElement | null, animationFrames: number[])
⋮----
function drawFrequency()
⋮----
function initAmplitudeCurveAnimation(canvas: HTMLCanvasElement | null, animationFrames: number[])
⋮----
function drawAmplitudeCurve()
⋮----
function initDynamicsAnimation(canvas: HTMLCanvasElement | null, animationFrames: number[])
⋮----
function drawDynamics()
⋮----
function initMeshAnimation(canvas: HTMLCanvasElement | null, animationFrames: number[])
⋮----
function drawMesh()
⋮----
function initTrackingAnimation(canvas: HTMLCanvasElement | null, animationFrames: number[])
⋮----
function drawTracking()
⋮----
function startProgressAnimation(progressBlocks: HTMLDivElement | null, intervals: number[])
function startAmplitudeBarAnimations(intervals: number[])
function startDotMatrixAnimation(dotMatrix: HTMLDivElement | null, intervals: number[])
````

## File: src/components/moon/Moon.tsx
````typescript
import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, TiltShift2 } from "@react-three/postprocessing";
import { Suspense, useRef } from "react";
````

## File: src/components/navbar/full-site-nav.tsx
````typescript
import {LayoutGroup, motion} from 'framer-motion'
import type React from 'react'
import {memo, useEffect, useState} from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {cn} from '@/utils'
import {SignedIn, SignedOut, SignInButton, UserButton, useUser} from '@clerk/nextjs'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {AnimatedMenuButton} from '@/components/ui/button/animated-menu-button'
⋮----
const handleMouseEnter = () =>
⋮----
const handleMouseLeave = () =>
⋮----
interface DropdownMenuDemoProps {
  isAdmin: boolean
}
⋮----
const handleOpen = (isOpen: boolean)
````

## File: src/components/sci-fi/engineer.tsx
````typescript

````

## File: src/components/sightings/sightings-ai-insights.tsx
````typescript
import type React from 'react'
import {motion} from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Progress} from '@/components/ui/progress'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type {
  SightingsAnalysisResult,
  GeoCluster,
  TemporalPattern,
  ShapePattern,
  Anomaly,
  Correlation,
} from '@/services/sightings/actions/sightings-ai-analysis'
const InsightContainer = (
⋮----
if (!patterns || patterns.length === 0)
return <EmptyState message='No temporal pattern data available' />
const chartConfig = patterns.reduce((config, pattern) =>
````

## File: src/components/toolbars/dynamic-toolbar/DynamicToolbar.tsx
````typescript
import {Avatar} from '@/components/ui/avatar'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {ChevronLeftIcon, Cross2Icon, MagnifyingGlassIcon, PlusIcon} from '@radix-ui/react-icons'
import {AnimatePresence, motion} from 'framer-motion'
import {MousePointerClick, Sparkles, SunMoon} from 'lucide-react'
import {useState} from 'react'
function cn(...classes: (string | boolean | undefined | null)[])
⋮----
const handleButtonClick = (buttonName: string) =>
⋮----
onChange=
````

## File: src/components/toolbars/mini-toolbar/MiniToolbar.tsx
````typescript
import {AnimatePresence, motion} from 'framer-motion'
import Image from 'next/image'
import {useState} from 'react'
function cn(...classes: (string | boolean | undefined | null)[])
⋮----
const handleToggle = () =>
⋮----
className=
````

## File: src/components/toolbars/animated-toolbar.stories.tsx
````typescript
import type {Meta, StoryObj} from '@storybook/react'
import {AnimatedToolbar} from './animated-toolbar'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/toolbars/animated-toolbar.tsx
````typescript
import {AnimatePresence, motion} from 'framer-motion'
import {MousePointerClick, Plus, Search, Sparkles, SunMoon, X} from 'lucide-react'
import Image from 'next/image'
import {useState} from 'react'
function cn(...classes: (string | boolean | undefined | null)[])
interface ToolbarProps {
  avatarUrl?: string
}
⋮----
const showNotification = (buttonName: string) =>
⋮----
onChange=
````

## File: src/components/toolbars/ModelActionToolbar.tsx
````typescript
import {useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {SunMoon, Sparkles, MousePointerClick} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  Cross2Icon,
  ChevronLeftIcon,
  ChevronDownIcon,
} from '@radix-ui/react-icons'
function cn(...classes: (string | boolean | undefined | null)[])
⋮----
const handleButtonClick = (buttonName: string) =>
⋮----
onChange=
````

## File: src/components/toolbars/motion-dynamic-toolbar.tsx
````typescript
import {useClickOutside} from '@/hooks/useClickOutside'
import {motion, MotionConfig} from 'framer-motion'
import {ArrowLeft, Search, User} from 'lucide-react'
import type React from 'react'
import {useRef, useState} from 'react'
import useMeasure from 'react-use-measure'
⋮----
function Button({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  ariaLabel?: string
})
````

## File: src/components/toolbars/toolbar-expandable.stories.tsx
````typescript
import React from 'react'
import type {Meta, StoryObj} from '@storybook/react'
import ToolbarExpandable from './toolbar-expandable'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/components/toolbars/toolbar-expandable.tsx
````typescript
import type React from 'react'
import {useEffect, useRef, useState} from 'react'
import useMeasure from 'react-use-measure'
import {AnimatePresence, motion, MotionConfig} from 'framer-motion'
import {Folder, MessageCircle, User, WalletCards} from 'lucide-react'
function cn(...classes: (string | boolean | undefined | null)[])
function useClickOutside(ref: React.RefObject<HTMLElement | null>, callback: () => void)
⋮----
function handleClickOutside(event: MouseEvent)
````

## File: src/components/toolbars/transition-panel.tsx
````typescript
import {
  AnimatePresence,
  type Transition,
  type Variant,
  motion,
  type MotionProps,
} from 'framer-motion'
function cn(...classes: (string | boolean | undefined | null)[])
type TransitionPanelProps = {
  children: React.ReactNode[]
  className?: string
  transition?: Transition
  activeIndex: number
  variants?: {enter: Variant; center: Variant; exit: Variant}
} & MotionProps
export function TransitionPanel({
  children,
  className,
  transition,
  variants,
  activeIndex,
  ...motionProps
}: TransitionPanelProps)
````

## File: src/components/ui/button/button.tsx
````typescript
import {Slot} from '@radix-ui/react-slot'
import {type VariantProps, cva} from 'class-variance-authority'
⋮----
import {cn} from '@/utils'
⋮----
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
````

## File: src/components/ui/button/index.tsx
````typescript

````

## File: src/components/ui/card/hover-card/hover-card.tsx
````typescript
import { useMotionValue } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import { useMotionTemplate, motion } from 'framer-motion'
import { cn } from '@/utils/cn'
⋮----
function onMouseMove(
⋮----
export const generateRandomString = ( length: number ) =>
export const Icon = (
````

## File: src/components/ui/card/list-card/list-card.tsx
````typescript
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import {
  AnimatePresence,
  LayoutGroup,
  Reorder,
  motion,
  useDragControls,
} from 'framer-motion'
import { Plus, RepeatIcon, Trash } from 'lucide-react'
import useMeasure from 'react-use-measure'
import { cn } from '@/utils'
import { Checkbox } from '@/components/ui/checkbox'
export type Item = {
  text: string
  checked: boolean
  id: number
  description: string
}
export interface SortableListItemProps {
  item: Item
  order?: number
  onCompleteItem: ( id: number ) => void
  onRemoveItem: ( id: number ) => void
  renderExtra?: ( item: Item ) => React.ReactNode
  isExpanded?: boolean
  className?: string
  handleDrag: () => void
}
⋮----
const handleDragStart = ( event: any ) =>
const handleDragEnd = () =>
⋮----
<motion.div className=
````

## File: src/components/ui/chat/markdown-content.tsx
````typescript
import { cn } from "@/utils";
import { marked } from "marked";
⋮----
import { Suspense, isValidElement, memo, useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
⋮----
const extractTextContent = (node: React.ReactNode): string =>
interface HighlightedPreProps extends React.HTMLAttributes<HTMLPreElement> {
	language: string;
}
⋮----
// biome-ignore lint/suspicious/noArrayIndexKey: Needed for react key
⋮----
// biome-ignore lint/suspicious/noArrayIndexKey: Needed for react key
⋮----
<pre
⋮----
className=
⋮----
function parseMarkdownIntoBlocks(markdown: string): string[]
interface MarkdownBlockProps {
	content: string;
	className?: string;
}
⋮----
interface MarkdownContentProps {
	content: string;
	id: string;
	className?: string;
}
⋮----
// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
````

## File: src/components/ui/badge.tsx
````typescript
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils"
⋮----
className=
````

## File: src/components/ui/dock.tsx
````typescript
import { cn } from '@/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import React, { PropsWithChildren, useRef } from 'react'
export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string
  magnification?: number
  distance?: number
  children: React.ReactNode
}
⋮----
const renderChildren = () =>
⋮----
onMouseMove=
⋮----
onMouseLeave=
⋮----
className=
⋮----
export interface DockIconProps {
  size?: number
  magnification?: number
  distance?: number
  mouseX?: any
  className?: string
  children?: React.ReactNode
  props?: PropsWithChildren
}
````

## File: src/components/ui/sidebar.tsx
````typescript
import {Slot} from '@radix-ui/react-slot'
import {type VariantProps, cva} from 'class-variance-authority'
import {PanelLeftIcon} from 'lucide-react'
import {useIsMobile} from '@/hooks/use-mobile'
import {cn} from '@/utils'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Separator} from '@/components/ui/separator'
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from '@/components/ui/sheet'
import {Skeleton} from '@/components/ui/skeleton'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip'
⋮----
type SidebarContext = {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}
⋮----
function useSidebar()
⋮----
const handleKeyDown = (event: KeyboardEvent) =>
⋮----
className=
````

## File: src/components/ui/tooltip.tsx
````typescript
import { cn } from "@/utils"
function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>)
function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>)
function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>)
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>)
⋮----
className=
````

## File: src/contexts/mindmap/mindmap.interface.ts
````typescript
import type { AddConnectionNodesFromSearchParams } from "@/contexts/mindmap";
import type { DatabaseSchema } from "@/db/xata";
import type { MindMapNode } from "@/features/mindmap/actions/fetch-next-mindmap-records";
import type { MindMapState, useMindMapStore } from "@/features/mindmap/store";
import type { Edge, Node, XYPosition, useReactFlow } from "@xyflow/react";
import { LayoutOptions } from '@/features/mindmap/layouts/organizeNodeLayout';
export interface MindMapContextType extends MindMapState {
	nodes: Node[];
	edges: Edge[];
	reactFlowInstance: ReturnType<typeof useReactFlow>;
	onNodesChange: ReturnType<
		(typeof useMindMapStore<MindMapState>)["onNodesChange"]
	>;
	onEdgesChange: ReturnType<
		(typeof useMindMapStore<MindMapState>)["onEdgesChange"]
	>;
	onConnect: ReturnType<(typeof useMindMapStore<MindMapState>)["onConnect"]>;
	onNodesDelete: ReturnType<
		(typeof useMindMapStore<MindMapState>)["onNodesDelete"]
	>;
	setNodes: ReturnType<(typeof useMindMapStore<MindMapState>)["setNodes"]>;
	setEdges: ReturnType<(typeof useMindMapStore<MindMapState>)["setEdges"]>;
	addNode: ReturnType<(typeof useMindMapStore<MindMapState>)["addNode"]>;
	updateNodeData: ReturnType<
		(typeof useMindMapStore<MindMapState>)["updateNodeData"]
	>;
	deleteNode: ReturnType<(typeof useMindMapStore<MindMapState>)["deleteNode"]>;
	addEdge: ReturnType<(typeof useMindMapStore<MindMapState>)["addEdge"]>;
	updateEdgeData: ReturnType<
		(typeof useMindMapStore<MindMapState>)["updateEdgeData"]
	>;
	graph: Record<string, { nodes: Node[]; edges: Edge[] }>;
	activeNode: Node | null;
	conciseViewActive: boolean;
	showLocationVisualization: boolean;
	locationsToVisualize: any[];
	keepLoadedOnMap: boolean;
	mindMapInstance: any;
	setGraph: (graph: Record<string, { nodes: Node[]; edges: Edge[] }>) => void;
	updateActiveNode: (node: Node | null) => void;
	toggleConciseView: () => void;
	turnOffConciseView: () => void;
	turnOnConciseView: () => void;
	toggleLocationVisualization: () => void;
	closeLocationVisualization: () => void;
	addLocationsToVisualize: (locations: any[]) => void;
	toggleKeepLoaded: () => void;
	setMindMapInstance: (instance: any) => void;
	createRootNodeEdges: (nodes: Node[], source: string | Node) => Edge[];
	assignPositionsToChildNodes: (parentNode: Node, childNodes: Node[]) => Node[];
	getRootNodeChildren: (type: string) => Promise<{
		groupNode: Node;
		groupNodeChildren: Node[];
		incomingEdges: Edge[];
	}>;
	addConnectionNodesFromSearch: (
		params: AddConnectionNodesFromSearchParams,
	) => {
		siblingNodes: Node[];
		siblingEdges: Edge[];
	} | null;
	addNodes: (nodes: Node | Node[]) => void;
	addEdges: (edges: Edge | Edge[]) => void;
	fitView: () => void;
	screenToFlowPosition: (position: XYPosition) => XYPosition;
	getNode: (id: string) => Node | undefined;
	getNodes: () => Node[];
	getEdges: () => Edge[];
	adjustViewport: (params: FlowPosition) => void;
	zoomIn: () => void;
	zoomOut: () => void;
	addUserInputNode: (params: {
		input: string;
		user: any;
		position?: XYPosition;
	}) => Node;
	findConnections: (node: Node) => Node[];
	addNextEntitiesToMindMap: (source: Node) => Promise<{
		groupNode: Node;
		groupNodeChildren: Node[];
	} | null>;
	detectNodeOverlap: (node: { id: string }) => Node[];
	saveMindMap: () => Promise<void>;
	restore: () => void;
	createSearchResultsLayout: (params: {
		sourceNode: Node;
		searchResults: any[];
	}) => { searchResultNodes: Node[]; searchResultEdges: Edge[] };
	retrieveEntitiesFromStore: (
		model: keyof DatabaseSchema,
	) => Promise<MindMapNode[]>;
	addMindmapChildNode: (params: {
		parentNode: Node;
		type: string;
		childNode: any;
		position: XYPosition;
	}) => { newNode: Node; newEdge: Edge };
	addMindMapGroupNode: (params: {
		connectionNode: Node;
		model: string;
		nodeType?: string;
		groupId: string;
		position: XYPosition;
	}) => void;
	loadNodesFromTableQuery: (params: {
		type: string;
		searchResults: any[];
		searchTerm: string;
	}) => Promise<{
		childNodes: { groupNode: Node; groupNodeChildren: Node[] };
	}>;
	organizeLayout: (options?: LayoutOptions) => void;
}
````

## File: src/contexts/state-of-disclosure-provider.tsx
````typescript
import type {NetworkGraphPayload} from '@/features/mindmap/actions/get-entity-network-graph-data'
import {createContext, useContext} from 'react'
export type StateOfDisclosureSchema = {
  records: NetworkGraphPayload['records']
  connections: NetworkGraphPayload['connections']
  searchRelatedDataPoints: any
}
⋮----
export interface StateOfDisclosureProviderProps {
  children: any
  stateOfDisclosure: any
}
export const StateOfDisclosureProvider: React.FC<StateOfDisclosureProviderProps> = ({
  stateOfDisclosure,
  children,
}) =>
export const useStateOfDisclosure: any = () =>
````

## File: src/db/xata/db/models.ts
````typescript
import { xata } from "@/db/xata/client";
import type { XataRecord } from "@xata.io/client";
type XataResponse = XataRecord[] | any[];
export const getAllEvents = async () =>
export const getAllTopics = async (): Promise<XataResponse> =>
export const getAllPersonnel = async (): Promise<XataResponse> =>
export const getAllTestimonies = async (): Promise<XataResponse> =>
export const getAllOrganizations = async () =>
export const getAllArtifacts = async () =>
export const getAllDocuments = async () =>
export const getAllTopicsExpertsConnections = async () =>
export const getAllEventsExpertsConnections = async () =>
export const getAllEventsTopicsExpertsConnections = async () =>
export const getAllTopicsTestimoniesConnections = async () =>
export const getAllOrganizationsMembers = async () =>
export const getAllConnectionsById = async (id: string) =>
````

## File: src/db/xata/db/search-operations.ts
````typescript
import { xata } from '@/db/xata/client'
import {
  connectionMapByEntityType,
  objectMapPlural,
  objectMapToSingular,
} from '@/utils'
import { text } from 'd3'
const findNestedId = async ( obj: any ): Promise<any[] | null> =>
const handleNested = async ( item: any ) =>
export const executePlatformWideConnectionSearch = async (
⋮----
const processResults = ( records: any ) =>
export const executeDatabaseTableQuery = async (
export const askXataWithAi = async (
⋮----
const fetchRecords = async ( recordIds: string[] )
⋮----
export const summarizeRecordConnections = async (
````

## File: src/db/xata/client.ts
````typescript
import { getXataClient } from "./xata";
import type { XataClient } from "./xata";
````

## File: src/features/3d/3d-pin/3d-pin-card.tsx
````typescript
import {PinContainer} from '@/features/3d/3d-pin/3d-pin'
export function ThreeDPinCard(
````

## File: src/features/3d/3d-pin/3d-pin.stories.ts
````typescript
import { ThreeDPinCard } from "./3d-pin-card";
import type { Meta, StoryObj } from "@storybook/react";
⋮----
type Story = StoryObj<typeof meta>;
````

## File: src/features/3d/3d-timeline-journey/stories/3d-timeline-journey.stories.ts
````typescript
import { Timeline } from "@/features/3d/3d-timeline-journey/timeline";
import type { Meta, StoryObj } from "@storybook/react";
⋮----
type Story = StoryObj<typeof meta>;
````

## File: src/features/3d/3d-timeline-journey/item.tsx
````typescript
import { useMemo, useRef } from 'react'
import {
  Mesh,
  Vector2,
  PlaneGeometry,
  ShaderMaterial,
  Color,
  MeshBasicMaterial,
} from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import frag from './shaders/item.frag'
import vert from './shaders/default.vert'
interface ItemProps {
  timeline: any
  texture: any
  data: { caption: string; link: string }
  month: string
  itemIndex: number
  itemIndexTotal: number
}
````

## File: src/features/3d/drawing-board/nodes.tsx
````typescript
import {
  createContext,
  useMemo,
  useRef,
  useState,
  useContext,
  useLayoutEffect,
  forwardRef,
  useEffect,
} from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  Box,
  DragControls,
  Html,
  Plane,
  QuadraticBezierLine,
  Text,
  View,
} from '@react-three/drei'
import { useDrag } from '@use-gesture/react'
import {
  StarsCard,
  StarsCardDescription,
  StarsCardTitle,
} from '@/components/ui/card/stars-card'
⋮----
function force( nodes: any, alpha: number )
````

## File: src/features/3d/globe-connections/bezier-3d-facade.tsx
````typescript
import { Object3DFacade, Instanceable3DFacade } from 'troika-3d'
import { BezierMesh } from 'troika-three-utils'
import { Color, DoubleSide, MeshStandardMaterial, Vector3 } from 'three'
⋮----
export class Bezier3DFacade extends Object3DFacade
⋮----
constructor(parent)
afterUpdate()
⋮----
export class Bezier3DInstanceableFacade extends Instanceable3DFacade
⋮----
set material(material)
````

## File: src/features/3d/scroll-through-3d/overlay.tsx
````typescript
import GlobeConnections from '@/features/3d/globe-connections/GlobeConnectionsExample'
import { useTexture, View } from '@react-three/drei'
import React, {
  forwardRef,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useIntersectionObserver } from '@uidotdev/usehooks'
import Image from 'next/image'
import { NEONS } from '@/utils/constants/colors'
import { Card3D } from '@/features/3d/3d-card/3d-card'
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
⋮----
interface OverlayEventImageProps {
  photo: any
}
⋮----
const handleScroll = ( e: any ) =>
const updateTimeFrame = ( position: any ) =>
````

## File: src/features/3d/scroll-through-3d/ScrollThroughThreeD.tsx
````typescript
import React, {useMemo, useRef, useEffect} from 'react'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {OrbitControls, Text} from '@react-three/drei'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
⋮----
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'
⋮----
function CameraController(
````

## File: src/features/3d/scroll-through-3d/ScrollTriggerScene.stories.tsx
````typescript
import type {Meta, StoryObj} from '@storybook/react'
import {ScrollThrough3D} from './ScrollThroughThreeD'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/features/3d/visualizations/diagram/3d-graph.tsx
````typescript
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  createRef,
  useCallback,
  useRef,
  useState
} from 'react'
⋮----
import { Node, Nodes } from './basic-nodes'
import { DOMAIN_MODEL_COLORS } from '@/utils/constants/colors'
import { a, useSpring, useTransition } from '@react-spring/three'
import { Physics } from '@react-three/cannon'
import {
  Instance,
  Instances,
  OrbitControls,
  TrackballControls
} from '@react-three/drei'
function Geometry(
⋮----
const calculateSphericalPosition = ( index: any, length: any ) =>
const calculatePosition = ( parentX, index, totalNodes, level ) =>
const calculateGridPositionAlt = (
    parent,
    index,
    gridSize = 20,
    baseYDistance = 0.5
) =>
const calculateGridPosition = ( parent, index, gridSize ) =>
const calculateRadialPosition = ( parent, index ) =>
````

## File: src/features/3d/visualizations/diagram/basic-nodes.tsx
````typescript
import {
  createContext,
  useMemo,
  useRef,
  useState,
  useContext,
  useLayoutEffect,
  forwardRef,
  useEffect,
} from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Box, Instance, QuadraticBezierLine, Text } from '@react-three/drei'
import { useDrag } from '@use-gesture/react'
import { useSphere } from '@react-three/cannon'
import { RigidBody, BallCollider } from '@react-three/rapier'
````

## File: src/features/3d/visualizations/diagram/nodes.tsx
````typescript
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
⋮----
import { useSphere } from '@react-three/cannon'
import {
  Billboard,
  QuadraticBezierLine,
  Text
} from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { BallCollider, RigidBody } from '@react-three/rapier'
import { useDrag } from '@use-gesture/react'
````

## File: src/features/3d/entity-network-graph-3d.tsx
````typescript
import type {NetworkGraphPayload} from '@/features/mindmap/actions/get-entity-network-graph-data'
import {DOMAIN_MODEL_COLORS} from '@/utils'
import type {JSONData} from '@xata.io/client'
import {type FC, useCallback, useRef} from 'react'
import {ForceGraph3D} from 'react-force-graph'
````

## File: src/features/ai/components/mindmap-search-ui/quick-load-button.tsx
````typescript
import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { PlusIcon, XIcon } from 'lucide-react'
import { cn } from '@/utils'
import { useMeasure } from 'react-use'
⋮----
interface QuickLoadButtonProps {
  children: any
}
⋮----
const toggleExpand = ()
⋮----
xmlns='http://www.w3.org/2000/svg'
⋮----
if ( newTabId !== activeTab && !isAnimating )
````

## File: src/features/ai/components/prompt-kit/markdown.tsx
````typescript
import {cn} from '@/utils'
import {marked} from 'marked'
import {memo, useId, useMemo} from 'react'
import ReactMarkdown, {type Components} from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {CodeBlock, CodeBlockCode} from './ai-markdown-message/code-block'
export type MarkdownProps = {
  children: string
  id?: string
  className?: string
  components?: Partial<Components>
}
function parseMarkdownIntoBlocks(markdown: string): string[]
function extractLanguage(className?: string): string
⋮----
className=
````

## File: src/features/ai/components/mindmap-entity-loader-card.tsx
````typescript
import {useRef, useCallback} from 'react'
const useWebcam = () =>
````

## File: src/features/ai/index.tsx
````typescript

````

## File: src/features/case-files/connections-ui/EntityConnectionsFlow.tsx
````typescript
import React, {useRef} from 'react'
import {type MotionValue, motion, useScroll, useTransform} from 'framer-motion'
import {Card, CardContent} from '@/components/ui/card'
function cn(...classes: (string | boolean | undefined | null)[])
interface Node {
  id: string
  type: 'logic' | 'input' | 'output' | 'request'
  title: string
  value?: string
  x: number
  y: number
}
⋮----
const getNodeById = (id: string)
const createPath = (startX: number, startY: number, endX: number, endY: number) =>
````

## File: src/features/case-files/easel-tabs/EaselTabs.tsx
````typescript
import {motion, AnimatePresence} from 'framer-motion'
function cn(...classes: (string | boolean | undefined | null)[])
⋮----
className=
````

## File: src/features/case-files/easel-tabs/index.tsx
````typescript

````

## File: src/features/case-files/folder/folder-flyout.tsx
````typescript
import type React from 'react'
import {useState} from 'react'
interface FolderProps {
  color?: string
  size?: number
  items?: React.ReactNode[]
  className?: string
}
const darkenColor = (hex: string, percent: number): string =>
⋮----
const handleClick = () =>
const handlePaperMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) =>
const handlePaperMouseLeave = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
) =>
⋮----
const getOpenTransform = (index: number) =>
⋮----
onMouseMove=
onMouseLeave=
````

## File: src/features/case-files/folder/folder-open.tsx
````typescript
function cn(...classes: (string | boolean | undefined | null)[])
````

## File: src/features/case-files/folder/folder-tabs.tsx
````typescript
import {BoxIcon, HouseIcon, PanelsTopLeftIcon} from 'lucide-react'
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
````

## File: src/features/case-files/notations-ui/index.tsx
````typescript

````

## File: src/features/case-files/stacked-cards/exploding-stack/index.tsx
````typescript
import {useState, useRef, useEffect} from 'react'
import {gsap} from 'gsap'
import {useGSAP} from '@gsap/react'
⋮----
interface Card {
  id: string
  title: string
  content: string
  color?: string
}
interface ExplodingStackProps {
  cards: Card[]
  spacing?: number
  rotationFactor?: number
  maxRotation?: number
  explodeOnHover?: boolean
}
⋮----
const toggleExplode = () =>
const handleKeyDown = (e: React.KeyboardEvent) =>
⋮----
const setCardRef = (el: HTMLDivElement | null, index: number): void =>
````

## File: src/features/case-files/stacked-cards/index.tsx
````typescript

````

## File: src/features/collab/room.tsx
````typescript
import type {ReactNode} from 'react'
import {LiveblocksProvider, RoomProvider, ClientSideSuspense} from '@liveblocks/react/suspense'
export function Room(
````

## File: src/features/data-viz/sightings/animated-arc-group-layer.tsx
````typescript
import { CompositeLayer } from '@deck.gl/core'
import { ArcLayer } from '@deck.gl/layers'
import { useCallback, useEffect, useState } from 'react'
class AnimatedArcGroupLayer extends CompositeLayer
⋮----
initializeState()
_startAnimation()
⋮----
const animate = () =>
⋮----
_startFadeIn()
⋮----
const fadeIn = () =>
⋮----
finalizeState()
renderLayers()
⋮----
export function useAnimatedArcGroupLayer(props)
````

## File: src/features/data-viz/sightings/animated-arc-layer.tsx
````typescript
import { ArcLayer } from '@deck.gl/layers'
export function AnimatedArcLayer({
  id = 'animated-arc-layer',
  data,
  getSourceColor = [0, 128, 255],
  getTargetColor = [255, 0, 128],
  getWidth = 2,
  getHeight = 1,
  getTilt = 0,
  visible = true,
  fadeIn = false,
  fadeSpeed = 0.05,
  onClickArc,
})
````

## File: src/features/data-viz/sightings/sightings-globe-refactored.tsx
````typescript
import {useState, useMemo, useEffect, useRef} from 'react'
import ReactMapboxGl, {Layer, Feature, Popup, ZoomControl} from 'react-mapbox-gl'
⋮----
import type {
  SightingsGlobeProps,
  GeoJSONFeature,
  FeatureInfo,
  FilterOptions,
  MapConfig,
} from './types'
import {DeckGLOverlay} from './components/deck-gl-overlay'
import {useMapInitialization} from './hooks/use-map-initialization'
import {useVisualizationLayers} from './hooks/use-visualization-layers'
import {useTimeSeriesAnimation} from './useTimeSeriesAnimation'
import {useFilterWithBatching} from './use-batched-processing'
import {
  isSignificantEvent,
  filterFeature,
  findSignificantEventsInTimeWindow,
} from './utils/sighting-filters'
import {flyToLocation, getUserLocation, formatDate} from './utils/map-utils'
import {SightingsTimeSeries} from '@/features/data-viz/sightings/components/sightings-timeseries/SightingsTimeSeries'
import {MapPopup} from './components/MapPopup'
⋮----
// Main component for the 3D Sightings Globe visualization
⋮----
// Extract initial sightings data from props
⋮----
// Use the time series animation hook (pass an empty object as required)
⋮----
// State to hold potentially updated sightings data from external file
⋮----
// Animation state
const [animationSpeed, setAnimationSpeed] = useState(1000) // ms between animation steps
⋮----
// Filtering state
⋮----
shape: '', // Filter by shape (e.g., 'cylinder', 'triangle', 'disc')
⋮----
country: '', // Filter by country
state: '', // Filter by state/province
isSignificantEvent: false, // Show only major events
⋮----
// Setup batched filtering - optimizes for large datasets
⋮----
// State to hold filtered results
⋮----
// Keep track of whether filtering is in progress
⋮----
// Apply filters whenever the source data or filter criteria change
⋮----
// Skip if no data
⋮----
// Set filtering flag for UI feedback
⋮----
// Use batched processing to avoid blocking the UI
⋮----
// Construct the filtered GeoJSON object
⋮----
const handleTimeRangeChange = (newRange: [number, number]) =>
⋮----
style={'mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9'}
⋮----
onClose=
⋮----
Time range:
````

## File: src/features/data-viz/sightings/useTimeSeriesAnimation.tsx
````typescript
import {useCallback, useRef, useState} from 'react'
export const useTimeSeriesAnimation = (years: number[]) =>
````

## File: src/features/data-viz/index.tsx
````typescript

````

## File: src/features/mindmap/actions/xata-to-xyflow.ts
````typescript
import { askXataWithAi } from "@/db/xata";
import { xata } from "@/db/xata";
import { organizeNodeLayout } from "../layouts/organizeNodeLayout";
type AskParams = {
	question: string;
	rules?: string;
	table?: string;
};
export const fetchRecords = async (recordIds: string[], table: string)
export const askAIAction = async (
export type ReactFlowNode = {
	id: string;
	type: string;
	position: { x: number; y: number };
	data: Record<string, any>;
	parentId?: string;
};
export type ReactFlowEdge = {
	id: string;
	source: string;
	target: string;
	type?: string;
	animated?: boolean;
	label?: string;
	style?: Record<string, any>;
};
export type XataToXYFlowResult = {
	nodes: ReactFlowNode[];
	edges: ReactFlowEdge[];
	answer?: string;
	sessionId?: string;
};
type XataResult = {
	answer: string;
	sessionId: string;
	records: any[];
};
async function transformForReactflow(
	xataResult: XataResult,
	sourceNode: ReactFlowNode,
	existingNodes: ReactFlowNode[],
	originalType: string,
	layoutType: 'horizontal' | 'vertical' | 'radial' | 'grid' = 'horizontal'
): Promise<XataToXYFlowResult>
type AskXataResponse = {
	answer: string;
	sessionId: string;
	records: string[];
};
export type XataToXYFlowParams = {
	question: string;
	table: string;
	rules: string;
	context: string;
	existingNodes: ReactFlowNode[];
	sourceNode: ReactFlowNode;
	sessionId?: string;
	layoutType?: 'horizontal' | 'vertical' | 'radial' | 'grid';
};
export type XataToXYFlowResponse = {
	nodes: ReactFlowNode[];
	edges: ReactFlowEdge[];
	xataResponse?: {
		answer: string;
		records: any[];
		sessionId: string;
		isStreaming?: boolean;
		streamingText?: string;
	};
	startStreaming?: () => Promise<{
		eventSource: EventSource;
		close: () => void;
	}>;
};
export const xataToXYFlow = async ({
	question,
	table,
	rules,
	context,
	existingNodes,
	sourceNode,
	sessionId,
	layoutType = 'horizontal',
}: XataToXYFlowParams): Promise<XataToXYFlowResponse> =>
export async function initiateStreamingQuery({
	question,
	table,
	rules,
}: {
	question: string;
	table: string;
	rules?: string;
})
export async function transformStreamResponse(
	streamingText: string,
	records: Record<string, unknown>[],
	sessionId: string,
	sourceNode: ReactFlowNode,
	existingNodes: ReactFlowNode[],
	table: string,
): Promise<XataToXYFlowResponse>
````

## File: src/features/mindmap/components/cards/entity-group-card/events-group-card.tsx
````typescript
import React, { MutableRefObject, useRef, useState } from "react"
import { motion } from "framer-motion"
import { twMerge } from "tailwind-merge"
⋮----
const containerRef = useRef<HTMLDivElement | null>( null )
⋮----
const [zIndex, setZIndex] = useState( 0 )
⋮----
className=
````

## File: src/features/mindmap/components/cards/event/event-globe-card.tsx
````typescript
import type { GlobeLocation } from '@/components/globes'
import { STOCK_PHOTOS, wait } from '@/utils'
import createGlobe from 'cobe'
import { format } from 'date-fns'
import { useEffect, useRef } from 'react'
⋮----
interface GlobeProps {
  dark?: boolean
  baseColor?: string
  glowColor?: string
  markerColor?: string
  opacity?: number
  brightness?: number
  offsetX?: number
  offsetY?: number
  scale?: number
  markers?: GlobeLocation[]
}
export function Globe( {
  dark = true,
  opacity = 1,
  brightness = 1,
  offsetX = 0,
  offsetY = 0,
  scale = 1,
  markers = []
}: GlobeProps )
⋮----
const locationToAngles = ( lat, long ) =>
⋮----
export const EventGlobeCard = (
````

## File: src/features/mindmap/components/cards/root-node-card/InputWithVanishAnimation.tsx
````typescript
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/utils'
⋮----
const startAnimation = () =>
const handleVisibilityChange = () =>
⋮----
const animate = ( start: number ) =>
⋮----
const animateFrame = ( pos: number = 0 ) =>
⋮----
const handleKeyDown = ( e: React.KeyboardEvent<HTMLInputElement> ) =>
const vanishAndSubmit = () =>
const handleSubmit = ( e: React.FormEvent<HTMLFormElement> ) =>
````

## File: src/features/mindmap/components/cards/root-node-card/root-node-card.tsx
````typescript
import {NumberTicker} from '@/components/animated/number-ticker'
import {DotGridBackgroundBlack} from '@/components/backgrounds'
import {Card, CardContent, CardDescription, CardFooter, CardHeader} from '@/components/ui/card/card'
import {capitalize, cn} from '@/utils'
⋮----
import {useNodesData} from '@xyflow/react'
import {useMindMap} from '@/contexts/mindmap'
import {memo, useCallback, useState} from 'react'
import {InputWithVanishAnimation} from '@/features/mindmap/components/cards/root-node-card/InputWithVanishAnimation'
import {initiateDatabaseTableQuery} from '@/features/mindmap/actions/search'
⋮----
<NumberTicker value=
⋮----
const updateSearchTerm = (event: any) =>
````

## File: src/features/mindmap/components/launchpad/launchpad.tsx
````typescript
import {Button} from '@/components/ui/button'
import {ScrollArea} from '@/components/ui/chat/scroll-area'
import {Input} from '@/components/ui/input'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {AnimatePresence, motion} from 'framer-motion'
import {ChevronLeft, Search, X} from 'lucide-react'
import Image from 'next/image'
import {useEffect, useState} from 'react'
interface Application {
  id: number
  name: string
  icon: string
  category: string
}
interface LaunchPadProps {
  applications: Application[]
}
⋮----
const toggleLaunchpad = (): void =>
const handleAppClick = (app: Application): void =>
const handleBackClick = (): void =>
````

## File: src/features/mindmap/components/menus/index.tsx
````typescript

````

## File: src/features/mindmap/components/menus/mindmap-animated-click-menu.tsx
````typescript
import {AnimatePresence, type MotionValue, motion, useMotionValue, useSpring} from 'framer-motion'
import {
  EventsIcon,
  KeyFiguresIcon,
  OrganizationsIcon,
  TestimoniesIcon,
  TopicsIcon,
} from '@/components/icons'
import {AddNote} from '@/components/note/AddNote'
import {useMindMap} from '@/contexts'
const mapRange = (
  inputLower: number,
  inputUpper: number,
  outputLower: number,
  outputUpper: number
) =>
⋮----
const setTransform = (
    item: HTMLElement & EventTarget,
    event: React.PointerEvent,
    x: MotionValue,
    y: MotionValue
) =>
⋮----
onClick=
````

## File: src/features/mindmap/components/note/BlockEditor/components/EditorHeader.tsx
````typescript
import {Icon} from '@/components/ui/Icon'
import {EditorInfo} from './EditorInfo'
import type {EditorUser} from '../types'
import type {WebSocketStatus} from '@hocuspocus/provider'
import {Toolbar} from '@/components/9-ui/toolbar'
export type EditorHeaderProps = {
  isSidebarOpen?: boolean
  toggleSidebar?: () => void
  characters: number
  words: number
  collabState: WebSocketStatus
  users: EditorUser[]
}
export const EditorHeader = ({
  characters,
  collabState,
  users,
  words,
  isSidebarOpen,
  toggleSidebar,
}: EditorHeaderProps) =>
````

## File: src/features/mindmap/components/note/extensions/AiImage/components/AiImageView.tsx
````typescript
import {type Extension, NodeViewWrapper, type NodeViewWrapperProps} from '@tiptap/react'
import {useCallback, useMemo, useState} from 'react'
import toast from 'react-hot-toast'
import {v4 as uuid} from 'uuid'
import type {ImageOptions} from '@tiptap-pro/extension-ai'
⋮----
import {Button} from '@/components/ui/Button'
import {Loader} from '@/components/ui/Loader'
import {Panel, PanelHeadline} from '@/components/ui/Panel'
import {Textarea} from '@/components/ui/Textarea'
import {Icon} from '@/components/ui/Icon'
import {Surface} from '@/components/ui/Surface'
import {DropdownButton} from '@/components/ui/Dropdown'
import {Toolbar} from '@/components/9-ui/toolbar'
⋮----
interface Data {
  text: string
  imageStyle?: ImageOptions
}
⋮----
onClick=
````

## File: src/features/mindmap/components/note/extensions/AiWriter/components/AiWriterView.tsx
````typescript
import {type Extension, NodeViewWrapper, type NodeViewWrapperProps} from '@tiptap/react'
import {useCallback, useMemo, useState} from 'react'
import toast from 'react-hot-toast'
import {v4 as uuid} from 'uuid'
import {Button} from '@/components/ui/Button'
import {Loader} from '@/components/ui/Loader'
import {Panel, PanelHeadline} from '@/components/ui/Panel'
import {Textarea} from '@/components/ui/Textarea'
import {Icon} from '@/components/ui/Icon'
import type {AiTone, AiToneOption} from '@/components/BlockEditor/types'
import {tones} from '@/services/constants'
⋮----
import {Toolbar} from '@/components/9-ui/toolbar'
import {Surface} from '@/components/ui/Surface'
import {DropdownButton} from '@/components/ui/Dropdown'
export interface DataProps {
  text: string
  addHeading: boolean
  tone?: AiTone
  textUnit?: string
  textLength?: string
  language?: string
}
⋮----
onClick=
````

## File: src/features/mindmap/components/note/extensions/BlockquoteFigure/BlockquoteFigure.ts
````typescript
import { mergeAttributes } from '@tiptap/core'
import { Figure } from '../Figure'
import { Quote } from './Quote'
import { QuoteCaption } from './QuoteCaption'
⋮----
interface Commands<ReturnType> {
    blockquoteFigure: {
      setBlockquote: () => ReturnType
    }
  }
⋮----
addExtensions()
renderHTML(
addKeyboardShortcuts()
addAttributes()
addCommands()
````

## File: src/features/mindmap/components/note/extensions/ImageBlock/components/ImageBlockMenu.tsx
````typescript
import {BubbleMenu as BaseBubbleMenu} from '@tiptap/react'
import React, {useCallback, useRef} from 'react'
import {type Instance, sticky} from 'tippy.js'
import {v4 as uuid} from 'uuid'
import {Toolbar} from '@/components/9-ui/toolbar'
import {Icon} from '@/components/ui/Icon'
import {ImageBlockWidth} from './ImageBlockWidth'
import type {MenuProps} from '@/components/menus/types'
import {getRenderContainer} from '@/services/utils'
````

## File: src/features/mindmap/components/note/extensions/MultiColumn/menus/ColumnsMenu.tsx
````typescript
import {BubbleMenu as BaseBubbleMenu} from '@tiptap/react'
import {useCallback} from 'react'
import {sticky} from 'tippy.js'
import {v4 as uuid} from 'uuid'
import type {MenuProps} from '@/components/menus/types'
import {getRenderContainer} from '@/services/utils/getRenderContainer'
import {Toolbar} from '@/components/9-ui/toolbar'
import {ColumnLayout} from '../Columns'
import {Icon} from '@/components/ui/Icon'
export const ColumnsMenu = (
````

## File: src/features/mindmap/components/note/extensions/SlashCommand/SlashCommand.ts
````typescript
import { Editor, Extension } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import Suggestion, { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion'
import { PluginKey } from '@tiptap/pm/state'
import tippy from 'tippy.js'
import { GROUPS } from './groups'
import { MenuList } from './MenuList'
⋮----
onCreate()
addProseMirrorPlugins()
⋮----
const getReferenceClientRect = () =>
scrollHandler = () =>
⋮----
onUpdate(props: SuggestionProps)
⋮----
const scrollHandler = () =>
⋮----
onKeyDown(props: SuggestionKeyDownProps)
onExit(props)
⋮----
addStorage()
````

## File: src/features/mindmap/components/note/extensions/Table/menus/TableColumn/index.tsx
````typescript
import {BubbleMenu as BaseBubbleMenu} from '@tiptap/react'
import React, {useCallback} from 'react'
⋮----
import {Toolbar} from '@/components/9-ui/toolbar'
import {isColumnGripSelected} from './utils'
import {Icon} from '@/components/ui/Icon'
import type {MenuProps, ShouldShowProps} from '@/components/menus/types'
````

## File: src/features/mindmap/components/note/extensions/Table/menus/TableRow/index.tsx
````typescript
import {BubbleMenu as BaseBubbleMenu} from '@tiptap/react'
import React, {useCallback} from 'react'
⋮----
import {Toolbar} from '@/components/9-ui/toolbar'
import {isRowGripSelected} from './utils'
import {Icon} from '@/components/ui/Icon'
import type {MenuProps, ShouldShowProps} from '@/components/menus/types'
````

## File: src/features/mindmap/components/note/extensions/TrailingNode/trailing-node.ts
````typescript
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
function nodeEqualsType(
export interface TrailingNodeOptions {
  node: string
  notAfter: string[]
}
⋮----
addOptions()
addProseMirrorPlugins()
````

## File: src/features/mindmap/components/note/extensions/index.ts
````typescript

````

## File: src/features/mindmap/components/note/menus/ContentItemMenu/ContentItemMenu.tsx
````typescript
import {Icon} from '@/components/ui/Icon'
import {Toolbar} from '@/components/9-ui/toolbar'
import DragHandle from '@tiptap-pro/extension-drag-handle-react'
import type {Editor} from '@tiptap/react'
⋮----
import {Surface} from '@/components/ui/Surface'
import {DropdownButton} from '@/components/ui/Dropdown'
import useContentItemActions from './hooks/useContentItemActions'
import {useData} from './hooks/useData'
import {useEffect, useState} from 'react'
export type ContentItemMenuProps = {
  editor: Editor
}
export const ContentItemMenu = (
````

## File: src/features/mindmap/components/note/menus/TextMenu/components/AIDropdown.tsx
````typescript
import {DropdownButton} from '@/components/ui/Dropdown'
import {Icon} from '@/components/ui/Icon'
import {Surface} from '@/components/ui/Surface'
import {Toolbar} from '@/components/9-ui/toolbar'
import {languages, tones} from '@/services/constants'
⋮----
import type {Language} from '@tiptap-pro/extension-ai'
import {useCallback} from 'react'
export type AIDropdownProps = {
  onSimplify: () => void
  onFixSpelling: () => void
  onMakeShorter: () => void
  onMakeLonger: () => void
  onEmojify: () => void
  onTldr: () => void
  onTranslate: (language: Language) => void
  onTone: (tone: string) => void
  onCompleteSentence: () => void
}
⋮----
<Dropdown.Item onClick=
````

## File: src/features/mindmap/components/note/menus/TextMenu/components/ContentTypePicker.tsx
````typescript
import {Icon} from '@/components/ui/Icon'
import type {icons} from 'lucide-react'
import {useMemo} from 'react'
⋮----
import {Toolbar} from '@/components/9-ui/toolbar'
import {Surface} from '@/components/ui/Surface'
import {DropdownButton, DropdownCategoryTitle} from '@/components/ui/Dropdown'
export type ContentTypePickerOption = {
  label: string
  id: string
  type: 'option'
  disabled: () => boolean
  isActive: () => boolean
  onClick: () => void
  icon: keyof typeof icons
}
export type ContentTypePickerCategory = {
  label: string
  id: string
  type: 'category'
}
export type ContentPickerOptions = Array<ContentTypePickerOption | ContentTypePickerCategory>
export type ContentTypePickerProps = {
  options: ContentPickerOptions
}
const isOption = (
const isCategory = (
⋮----
isActive=
````

## File: src/features/mindmap/components/note/menus/TextMenu/components/EditLinkPopover.tsx
````typescript
import {LinkEditorPanel} from '@/components/panels'
import {Icon} from '@/components/ui/Icon'
import {Toolbar} from '@/components/9-ui/toolbar'
⋮----
export type EditLinkPopoverProps = {
  onSetLink: (link: string, openInNewTab?: boolean) => void
}
export const EditLinkPopover = (
````

## File: src/features/mindmap/components/note/menus/TextMenu/TextMenu.tsx
````typescript
import {Icon} from '@/components/ui/Icon'
import {Toolbar} from '@/components/9-ui/toolbar'
import {useTextmenuCommands} from './hooks/useTextmenuCommands'
import {useTextmenuStates} from './hooks/useTextmenuStates'
import {BubbleMenu, type Editor} from '@tiptap/react'
import {memo} from 'react'
⋮----
import {Surface} from '@/components/ui/Surface'
import {ColorPicker} from '@/components/panels'
import {FontFamilyPicker} from './components/FontFamilyPicker'
import {FontSizePicker} from './components/FontSizePicker'
import {useTextmenuContentTypes} from './hooks/useTextmenuContentTypes'
import {ContentTypePicker} from './components/ContentTypePicker'
import {AIDropdown} from './components/AIDropdown'
import {EditLinkPopover} from './components/EditLinkPopover'
⋮----
export type TextMenuProps = {
  editor: Editor
}
````

## File: src/features/mindmap/components/note/panels/Colorpicker/ColorButton.tsx
````typescript
import { cn } from '@/utils'
import { memo, useCallback } from 'react'
export type ColorButtonProps = {
  color?: string
  active?: boolean
  onColorChange?: ( color: string ) => void
}
````

## File: src/features/mindmap/components/note/panels/LinkPreviewPanel/LinkPreviewPanel.tsx
````typescript
import {Icon} from '@/components/ui/Icon'
import {Surface} from '@/components/ui/Surface'
import {Toolbar} from '@/components/9-ui/toolbar'
import Tooltip from '@/components/ui/tooltip/tooltip'
export type LinkPreviewPanelProps = {
  url: string
  onEdit: () => void
  onClear: () => void
}
export const LinkPreviewPanel = (
````

## File: src/features/mindmap/components/note/ui/Tooltip/index.tsx
````typescript
import Tippy from '@tippyjs/react/headless'
import React, { useCallback } from 'react'
import { TippyProps, TooltipProps } from './types'
⋮----
const ShortcutKey = (
````

## File: src/features/mindmap/components/status-ui/case-files-and-evidence-board.tsx
````typescript
import {EvidenceCard} from '@/features/case-files/case-file/case-file-evidence/evidence-card'
import {Card} from '@/components/ui/card'
import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'
import {File, FolderArchive} from 'lucide-react'
interface Evidence {
  id: string
  caseNumber: string
  classification: 'top-secret' | 'classified' | 'confidential'
  timestamp: string
  title: string
  description: string
  credibilityScore?: number
  sourceVerified?: boolean
}
⋮----
onHoverEnd=
onClick=
````

## File: src/features/mindmap/components/status-ui/session-notes.tsx
````typescript
import {useState} from 'react'
import {Drawer} from 'vaul-base'
import {motion} from 'framer-motion'
import {FileText, BookOpen, PlusCircle, Star, Edit3, Tag, Clock} from 'lucide-react'
import {Button} from '@/components/ui/button'
interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  timestamp: string
  isPinned?: boolean
}
⋮----
const handleNoteSelect = (note: Note) =>
const togglePin = (id: string) =>
const createNewNote = () =>
⋮----
onHoverEnd=
onClick=
⋮----
e.stopPropagation()
togglePin(note.id)
````

## File: src/features/mindmap/components/status-ui/thread-board.tsx
````typescript
import {EvidenceCard} from '@/features/case-files/case-file/case-file-evidence/evidence-card'
import {Card} from '@/components/ui/card'
import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'
import {GitBranch, PlusCircle, Pin, Folder, PinIcon, Terminal} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {PinTopIcon} from '@radix-ui/react-icons'
import {ArtifactsIcon, DocumentsIcon, Dots} from '@/components/icons'
interface Thread {
  id: string
  caseNumber: string
  classification: 'top-secret' | 'classified' | 'confidential'
  timestamp: string
  title: string
  description: string
  credibilityScore?: number
  sourceVerified?: boolean
  isActive?: boolean
}
⋮----
const setActiveThread = (id: string) =>
const createNewThread = () =>
const handleFileDrop = (threadId: string) =>
⋮----
onHoverEnd=
onClick=
⋮----
onDrop=
````

## File: src/features/mindmap/components/ask-ai.tsx
````typescript
import {askAIAction} from '@/features/mindmap/actions/xata-to-xyflow'
import {useSSE} from '@/hooks/useSSE'
import {Loader2, RefreshCw} from 'lucide-react'
import {useEffect, useState} from 'react'
interface AskAIProps {
  question: any
  prompt?: any
  table: any
  children?: React.ReactNode
  updateAnalysis: (analysis: any) => void
}
⋮----
export const AskAIStreaming: React.FC<AskAIStreamingProps> = ({
  question,
  table,
  rules = [],
  nodeId,
  onComplete,
  onError,
}) =>
⋮----
onClick=
````

## File: src/features/mindmap/components/example-client-component.tsx
````typescript
import {useCallback, useEffect, useState} from 'react'
import {type MindMapNode, fetchNextMindmapRecords} from '../actions/fetch-next-mindmap-records'
⋮----
export function MindmapExplorer(
⋮----
const handleTableChange = (newTable: string) =>
⋮----
onChange=
````

## File: src/features/mindmap/config/edge-types.tsx
````typescript
import {BaseEdge, BezierEdge, SmoothStepEdge, StraightEdge} from '@xyflow/react'
import {AnimatedSvgEdge} from '@/features/mindmap/edges/animated-svg-edge'
import {DataEdge} from '@/features/mindmap/edges/data-edge'
````

## File: src/features/mindmap/config/node-types.tsx
````typescript
import {
  EntityGroupNode,
  EntityGroupNodeChild,
  EntityNode,
  TestimonyNode,
} from '@/features/mindmap/nodes'
import {AnnotationNode} from '@/features/mindmap/nodes/AnnotationNode'
import {DocumentNode} from '@/features/mindmap/nodes/document-node'
import {GroupResultsNode} from '@/features/mindmap/nodes/group-results-node'
import {PersonnelGroupNode} from '@/features/mindmap/nodes/personnel-group-node'
import {PersonnelGroupNodeChild} from '@/features/mindmap/nodes/personnel-group-node-child'
import {UserInputNode} from '@/features/mindmap/nodes/user-input-node/user-input-node'
````

## File: src/features/mindmap/hooks/useGroupNode.tsx
````typescript
import { useMindMap } from '@/contexts'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Node, NodeProps } from '@xyflow/react'
interface UseGroupNodeProps {
  node: NodeProps & {
    width: number
    height: number
    id: string
    data: {
      children?: Node[]
      [key: string]: unknown
    }
  }
}
interface PositionedNode extends Node {
  position: {
    x: number
    y: number
  }
}
interface UseGroupNodeReturn {
  handles: string[]
  childNodeIds: string[]
  updateGroupHeight?: () => void
  hideChildren: () => void
  showChildren: () => void
  positionChildNodes?: () => PositionedNode[]
  getClonePosition?: ( selector?: string, ref?: React.RefObject<HTMLElement> ) => { x: number; y: number } | null
  node: Node & {
    width: number
    height: number
    id: string
    data: {
      children?: any[]
      handles?: any[]
      input?: string
      source?: Record<string, any>
      [key: string]: unknown
    }
  }
}
export const useGroupNode = (
⋮----
const hideChildren = () =>
const showChildren = () =>
````

## File: src/features/mindmap/layouts/algorithms/entitree-flex.ts
````typescript
import { CHILD_DIMENSIONS } from "@/features/mindmap/config/nodes.config";
import { Position } from "@xyflow/react";
import { layoutFromMap } from "entitree-flex";
⋮----
interface Node {
	id: string;
	name: string;
	x: number;
	y: number;
	isSpouse?: boolean;
	isSibling?: boolean;
	[key: string]: any;
}
interface Edge {
	source: Node;
	target: Node;
}
export const layoutElementsTreeFlex = (
	tree: any,
	rootId: any,
	direction: "TB" | "LR" = "TB",
) =>
````

## File: src/features/mindmap/layouts/organizeNodeLayout.ts
````typescript
import { Node, Edge } from '@xyflow/react';
export type ReactFlowNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, any>;
  parentId?: string;
  width?: number;
  height?: number;
};
export type ReactFlowEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  label?: string;
  style?: Record<string, any>;
};
export interface LayoutOptions {
  direction?: 'horizontal' | 'vertical' | 'radial' | 'grid';
  parentChildSpacing?: number;
  siblingSpacing?: number;
  nodeWidth?: number;
  nodeHeight?: number;
  centerChildren?: boolean;
  compactLayout?: boolean;
  groupPadding?: number;
}
export function organizeNodeLayout(
  nodes: ReactFlowNode[],
  edges: ReactFlowEdge[],
  options: LayoutOptions = {}
): ReactFlowNode[]
⋮----
const getNodeWidth = (node: ReactFlowNode) => node.width ||
      (node.data?.style?.width ? parseInt(node.data.style.width.toString(), 10) : nodeWidth);
const getNodeHeight = (node: ReactFlowNode) => node.height ||
      (node.data?.style?.height ? parseInt(node.data.style.height.toString(), 10) : nodeHeight);
⋮----
export function createGroupWithLayout(
  parentData: {
    id: string;
    position: { x: number; y: number };
    type?: string;
    data?: any;
    style?: React.CSSProperties;
  },
  childrenData: Array<{
    id: string;
    type?: string;
    data?: any;
  }>,
  layoutOptions: LayoutOptions = {}
):
````

## File: src/features/mindmap/nodes/user-input-node/animated-markdown.tsx
````typescript
import {Markdown, type MarkdownProps} from '@/features/ai/components/prompt-kit/markdown'
import {AnimatePresence, motion} from 'framer-motion'
import {memo, useId, useMemo} from 'react'
import {cn} from '@/utils'
⋮----
function parseContentIntoBlocks(content: string): string[]
export interface AnimatedMarkdownProps extends MarkdownProps {
  delay?: number
  staggerDelay?: number
  animateExit?: boolean
  customVariants?: {
    container?: typeof containerVariants
    block?: typeof blockVariants
  }
}
// A simple component that wraps a block of markdown content with animation
⋮----
<MotionMarkdown variants=
````

## File: src/features/mindmap/nodes/core-node-ui.tsx
````typescript
import {cn} from '@/utils'
import {motion} from 'framer-motion'
import type React from 'react'
import type {RefObject} from 'react'
interface CoreNodeAvatarProps {
  image: {
    url: string
  }
}
export const OracleMode = (
interface CoreNodePillProps {
  label: string
}
export const CoreNodePill: React.FC<CoreNodePillProps> = (
export const CoreNodeAvatar: React.FC<CoreNodeAvatarProps & {label?: string}> = ({
  image,
  label,
}) =>
interface CoreNodeBottomProps {
  children: React.ReactNode
}
export const CoreNodeBottom: React.FC<CoreNodeBottomProps> = (
⋮----
interface CoreNodeContentProps {
  className?: string
  children: React.ReactNode
}
export const CoreNodeContent: React.FC<CoreNodeContentProps> = (
⋮----
className=
⋮----
interface CoreNodeContainerProps {
  children: React.ReactNode
  id: string
  className?: string
  ref?: RefObject<HTMLDivElement>
}
export const CoreNodeContainer: React.FC<CoreNodeContainerProps> = ({
  children,
  id,
  className,
  ref,
}) =>
````

## File: src/features/mindmap/nodes/personnel-group-node.tsx
````typescript
import { memo, useEffect, useState } from 'react'
import { KeyFiguresIcon } from '@/components/icons'
import { CoreNodeBottom, CoreNodeContainer, CoreNodeContent } from '@/features/mindmap/nodes/core-node-ui'
import { useMindMap } from '@/contexts'
import { Handle, Position } from '@xyflow/react'
import { SparklesIcon } from 'lucide-react'
export const AiButton: React.FC = () =>
````

## File: src/features/mindmap/nodes/root-node.tsx
````typescript
import { Handle, Position, type Node } from '@xyflow/react'
import { memo, useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
type CardProps = React.ComponentProps<typeof Card>
import { BlurAppear } from '@/components/animated/animated-wrappers'
import { RootNodeCard } from '@/features/mindmap/components/cards/root-node-card/root-node-card'
import { useMindMap } from '@/contexts'
type NumberNode = Node<{ number: number }, 'number'>
export type RootNode = Node<{
  data: {
    name: string
    type: string
    childCount: number
    label: string
    url: string
    handles: string[]
    concise?: boolean
  }
  handles?: string[]
}>
````

## File: src/features/mindmap/workflows/generate-ai-text.ts
````typescript
import type { Model } from "@/features/ai/components/prompt-kit/ai-markdown-message/model-selector";
import type { GenerateTextNode } from "@/features/mindmap/workflows/generate-text-node";
import { deepseek } from "@ai-sdk/deepseek";
import { groq } from "@ai-sdk/groq";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { z } from "zod";
interface ToolResult {
	id: string;
	name: string;
	result: string;
}
function createAIClient(model: Model)
function mapToolsForAI(
	tools: GenerateTextNode["data"]["dynamicHandles"]["tools"],
)
export async function generateAIText({
	prompt,
	system,
	model,
	tools,
}: {
	prompt: string;
	system?: string;
	model: Model;
	tools: GenerateTextNode["data"]["dynamicHandles"]["tools"];
})
````

## File: src/features/mindmap/workflows/generate-text-node-controller.tsx
````typescript
import type {Model} from '@/features/ai/components/prompt-kit/ai-markdown-message/model-selector'
import {GenerateTextNode} from '@/features/mindmap/workflows/generate-text-node'
import {useWorkflow} from '@/hooks/flow/use-workflow'
import type {NodeExecutionState} from '@/lib/flow/workflow-execution-engine'
import type {NodeProps} from '@xyflow/react'
import {useCallback} from 'react'
import {toast} from 'sonner'
export type GenerateTextNodeController = Omit<GenerateTextNode, 'data'> & {
  type: 'generate-text'
  data: Omit<GenerateTextNode['data'], 'status'> & {
    executionState?: NodeExecutionState
  }
}
export function GenerateTextNodeController({
  id,
  data,
  ...props
}: NodeProps<GenerateTextNodeController>)
````

## File: src/features/mindmap/workflows/sse-workflow-execution-client.ts
````typescript
import type { WorkflowDefinition } from "@/lib/flow/workflow";
import type { NodeExecutionState } from "@/lib/flow/workflow-execution-engine";
export interface SSEWorkflowExecutionEventHandlers {
	onNodeUpdate: (nodeId: string, state: NodeExecutionState) => void;
	onError: (error: Error, nodeId?: string) => void;
	onComplete: ({ timestamp }: { timestamp: string }) => void;
}
export class SSEWorkflowExecutionClient
⋮----
async connect(
		workflow: WorkflowDefinition,
		handlers: SSEWorkflowExecutionEventHandlers,
): Promise<void>
disconnect(): void
````

## File: src/hooks/use3dGraph.tsx
````typescript
import type {NetworkGraphPayload} from '@/features/mindmap/actions/get-entity-network-graph-data'
import {useEffect, useState} from 'react'
type EntityGraphSchema = {
  nodes: Node
}
export type GraphState = {
  root: {
    nodes: []
    links: {}
  }
  events: {
    nodes: []
    links: {}
  }
  testimonies: {
    nodes: []
    links: {}
  }
  personnel: {
    nodes: []
    links: {}
  }
  topics: {
    nodes: []
    links: {}
  }
  organizations: {
    nodes: []
    links: []
  }
  documents: {
    nodes: []
    links: []
  }
  artifacts: {
    nodes: []
    links: []
  }
}
export type UseGraphProps = {
  mindMapIntialGraphState: NetworkGraphPayload['graphData']
}
export const use3DGraph = (
````

## File: src/hooks/useBackendChat.ts
````typescript
import {  useRef, useEffect, useState, useCallback } from "react";
import { customAlphabet } from "nanoid";
import type { UseChatOptions } from "ai/react";
import type {
  ChatRequestOptions,
  CreateMessage,
  Message,
} from "ai";
import usePartySocket from "partysocket/react";
⋮----
export function useBackendChat({
  id,
  initialMessages = [DEFAULT_SYSTEM_MESSAGE],
  initialInput = "",
}: UseChatOptions =
⋮----
// Generate a unique id for the chat if not provided
⋮----
// 👋 open a socket so that we can broadcast streaming responses from
// openai api to any connected clients.
⋮----
// We use the socket id as the `requestId` that is used to track the workflow
⋮----
// Keep a mutable buffer of incoming messages
⋮----
// Keep the latest messages in a ref.
⋮----
// Abort controller to cancel the current API call.
//
// TODO: Send cancellation event.
⋮----
// This is the end of our token stream.
⋮----
const handleInputChange = (e: any) =>
// Input state and handlers.
````

## File: src/hooks/useCanvasCursor.tsx
````typescript
import { useEffect } from "react";
const useCanvasCursor = () =>
⋮----
function n(e)
⋮----
function Line(e)
⋮----
function onMousemove(e)
⋮----
function o()
function c(e)
function l(e)
⋮----
function render()
function resizeCanvas()
⋮----
function Node()
const renderCanvas = () =>
````

## File: src/hooks/useEntity.tsx
````typescript
import {useMindMap} from '@/contexts'
import {
  initiateDatabaseWideConnectionSearch,
  initiateRagEnrichedDatabaseSearch,
} from '@/features/mindmap/actions/search'
import {saveEventForUser} from '@/features/user/api/save-event'
import {objectMapToSingular} from '@/utils'
import {useAuth} from '@clerk/nextjs'
import {useCallback, useState} from 'react'
export const useEntity = (
⋮----
const handleHoverLeave = () =>
const handleHoverEnter = () =>
⋮----
const updateNote = (
⋮----
const addEntityToMindMap = (cardId: any) =>
⋮----
const element: any = document.getElementById(domId) // Select your element
⋮----
const x = rect.left // X position
const y = rect.top // Y position
⋮----
// getNodesBounds
// const updatedNode = {s
//   ...siblingSourceNode,
//   hidden: false,
// }
⋮----
const saveNote = async () =>
````

## File: src/hooks/useTextAnimator.tsx
````typescript
import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useTextSplitter } from './useTextSplitter'
import SplitText from 'gsap'
⋮----
export const useTextAnimator = (textElementRef, options =
````

## File: src/layouts/historical-events-timeline/events-globe.tsx
````typescript
import { locationToAngles } from '@/utils'
import { AdaptiveDpr, OrbitControls, shaderMaterial, useTexture } from '@react-three/drei'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import createGlobe from 'cobe'
import { useEffect, useRef, useState } from 'react'
⋮----
const zoom = ( delta ) =>
⋮----
const getColor = ( value ) =>
````

## File: src/layouts/historical-events-timeline/events-timeline.tsx
````typescript
import {format} from 'date-fns'
import {Divz} from 'divz'
import {motion} from 'framer-motion'
import gsap from 'gsap'
import Image from 'next/image'
import {useCallback, useEffect, useRef, useState} from 'react'
⋮----
import {useGSAP} from '@gsap/react'
import {ScrollSmoother} from 'gsap-trial/ScrollSmoother'
import {ScrollTrigger} from 'gsap-trial/ScrollTrigger'
import {Float} from '@/components/animated/float'
import {ICON_BLUE} from '@/utils'
⋮----
import ReactPlayer from 'react-player'
⋮----
interface CrosshairConfig {
  topLeft?: boolean
  topRight?: boolean
  bottomLeft?: boolean
  bottomRight?: boolean
}
interface YearLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  crosshairs?: CrosshairConfig
  gridLines?: boolean
  columns?: 8 | 12 | 16
  lineVariant?: 'all' | 'vertical' | 'horizontal' | 'center' | 'none'
}
function CrosshairIcon(
export function YearLayout({
  children,
  crosshairs,
  gridLines = true,
  className,
  ...props
}: YearLayoutProps)
````

## File: src/layouts/historical-events-timeline/historical-events-timeline.stories.tsx
````typescript
import type {EventsRecord} from '@/db/xata'
import type {Meta, StoryObj} from '@storybook/react'
import type {JSONData} from '@xata.io/client'
import {Suspense} from 'react'
import {HistoricalEventsTimeline} from './historical-events-timeline'
````

## File: src/layouts/historical-events-timeline/HorizontalTimeline.tsx
````typescript
import {TextScramble} from '@/components/animated/text-effect/text-scramble/text-scramble'
import {animate, motion} from 'framer-motion'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
⋮----
const createLine = () =>
const updatePath = () =>
````

## File: src/layouts/home/home.tsx
````typescript
import {TitleAlt} from '@/layouts/home/TitleAlt'
import {AnimatePresence} from 'framer-motion'
import dynamic from 'next/dynamic'
⋮----
export type HomeProps = {}
export const Home: React.FC<HomeProps> = () =>
````

## File: src/services/ai/openai/functions/functions.ts
````typescript
import { metadata } from '@/app/layout'
import type { DatabaseSchema } from '@/db/xata'
import { openai } from '@/lib/openai/client'
import { DISCLOSURE_ASSISTANT_ID, INSTRUCTIONS } from '@/services/ai/openai/config'
import { askHow, formatRelatedItems, parseApiResponse } from '@/services/ai/openai/helpers'
import { assistantEventHandler } from '@/services/ai/openai/stream-handler'
import { searchDatabase } from '@/services/ai/openai/tools/search-database'
import { AssistantResponse } from 'ai'
import { traceable } from 'langsmith/traceable'
type AnyDatabaseSchema = DatabaseSchema[keyof DatabaseSchema]
````

## File: src/services/ai/prompts/disclosure-assistant.prompt.ts
````typescript

````

## File: src/services/ai/prompts/researchers.prompt.ts
````typescript

````

## File: src/services/ai/workflows/prompt-to-multistep.workflow.ts
````typescript
import { askXataWithAi } from "@/db/xata/db/search-operations";
import { openai } from "@/lib/openai/client";
import { DISCLOSURE_ASSISTANT_ID } from "@/services/ai/openai/config";
import { assistantEventHandler } from "@/services/ai/openai/stream-handler";
import { NER_EXTRACTION_PROMPT } from "@/services/ai/prompts/ner-extraction-prompt";
import { AssistantResponse } from "ai";
export async function POST(req: Request)
````

## File: src/services/knowledge-layer/memory.ts
````typescript
import { memoryAgent } from "@/lib/mem0";
import { DISCLOSURE_ASSISTANT_ID } from "@/services/ai/openai/config";
type Message = {
	content: Array<{ text: string }>;
};
type MemoryMetadata = {
	source?: any;
	assistantAnswer?: Message;
	[key: string]: any;
};
type EntityType =
	| "events"
	| "personnel"
	| "topics"
	| "testimonies"
	| "organizations";
⋮----
const addMemory = async (message: any, options: any) =>
const addMemorySeries = async (messages: any, options: any) =>
export const addConversationToDisclosureAssistantMemory = async ({
	messages,
	metadata = null,
}: {
	messages: any;
	metadata?: MemoryMetadata | null;
}) =>
export const searchMemory = async ({
	query,
	metadata,
}:
export const storeUserCoreMemory = async ({
	user,
	contentToStore,
	metadata,
}: {
	user: { id: string };
	contentToStore: any;
	metadata?: MemoryMetadata;
}) =>
export const getUserMemories = async (
export const getAssistantMemories = async () =>
export const addCustomizedMemory = async ({
	messages,
	includes,
}: {
	messages: any;
	includes: string;
}) =>
export const rememberEntityConnections = async ({
	type,
	source,
	assistantAnswer,
}: {
	type: EntityType | string;
	source: { id: string };
	assistantAnswer: Message;
}) =>
````

## File: src/services/knowledge-layer/process-resource.ts
````typescript
import { askXataWithAi } from "@/db/xata";
import { getClaudeSummary } from "@/services/ai/claude/get-claude-response";
import { generateEmbeddings } from "@/services/ai/embeddings/embedding";
import { SUMMARIZE_PROMPT } from "@/services/ai/prompts/summarize.prompt";
import {
	scrapeWithFireCrawl,
	deepResearch,
	ResearchCategory,
	ResearchDepth,
} from "@/services/resource-scrape";
import { EXTERNAL_RESOURCES } from "@/utils";
export type ResourceProcessingOptions = {
	useDeepResearch?: boolean;
	researchDepth?: ResearchDepth;
	categories?: ResearchCategory[];
	recursiveLinks?: boolean;
	linkDepth?: number;
	extractionModel?: string;
	updateExisting?: boolean;
};
export const processResource = async (
	resourceUrl: string,
	options: ResourceProcessingOptions = {},
) =>
⋮----
// Process with Claude for summarization
⋮----
export const processMultipleResources = async (
	options: ResourceProcessingOptions & {
		resourceCount?: number;
resourceFilter?: (url: string)
````

## File: src/services/resource-scrape/index.ts
````typescript

````

## File: src/tests/mindmap-flow-test.tsx
````typescript
import React, {useEffect, useState} from 'react'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {traceLogger} from '@/utils/trace-logger'
import type {MindMapNode} from '@/features/mindmap/actions/fetch-next-mindmap-records'
import type {DatabaseSchema} from '@/db/types'
import type {Node, Edge, XYPosition} from '@xyflow/react'
interface TestState {
  isLoading: boolean
  entities: MindMapNode[]
  error: string | null
  testComplete: boolean
}
interface NodeWithParentId extends Node {
  parentId?: string
}
⋮----
const computeChildPositions = (parentNode: NodeWithParentId, numberOfChildren: number) =>
const calculateCenterOfScreen = (): XYPosition =>
const handleLoadingRecords = async (type: string) =>
const addDataToMindMap = (model: string) =>
````

## File: .eslintrc
````
{
	"extends": ["next/core-web-vitals", "prettier", "next"],
	"rules": {
		"react/no-unescaped-entities": "off",
		"react/no-children-prop": "off",
		"react/display-name": "off",
		"@next/next/no-img-element": "off",
		"jsx-a11y/alt-text": "warn",
		"no-unused-vars": "warn",
		"@typescript-eslint/no-unused-vars": "warn",
		"@typescript-eslint/no-explicit-any": "warn",
		"prefer-const": "warn"
	}
}
````

## File: .repomixignore
````
/public/assets/audio/interstellar-stay.mp3
/public/
./src/features/3d/globe-connections/countries.geojson.json
./src/components/globes/countries.json
./public/sightings.geojson
/node_modules/
.next/
.xata/
.storybook/
/templates/
./src/components/icons/
./src/components/animated/
./src/lib/
/public/
/docs/
.cursor/
./src/utils/
./scripts/
package.json
*.css
````

## File: eslint.config.mjs
````
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
⋮----
const compat = new FlatCompat({
⋮----
...compat.extends("next/core-web-vitals", "next/typescript"),
````

## File: plopfile.js
````javascript
function addWorkspacePrompt(templateConfig) {
⋮----
const packageJsonPath = path.join(process.cwd(), "package.json");
if (fs.existsSync(packageJsonPath)) {
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
⋮----
workspaces = Array.isArray(packageJson.workspaces)
⋮----
console.warn("Error reading workspaces:", error.message);
⋮----
? workspaces.map((ws) => ({ name: ws, value: ws }))
⋮----
plop.setGenerator("component", addWorkspacePrompt(componentTemplate));
plop.setGenerator("page", addWorkspacePrompt(pageTemplate));
plop.setGenerator("feature", addWorkspacePrompt(featureTemplate));
plop.setGenerator("api", addWorkspacePrompt(apiTemplate));
plop.setGenerator("webhook", addWorkspacePrompt(webhookTemplate));
````

## File: postcss.config.mjs
````

````

## File: repomix.config.json
````json
{
  "output": {
    "filePath": "repomix-output.md",
    "style": "markdown",
    "parsableStyle": false,
    "fileSummary": false,
    "directoryStructure": true,
    "removeComments": true,
    "removeEmptyLines": true,
    "compress": true,
    "topFilesLength": 5,
    "showLineNumbers": false,
    "copyToClipboard": false,
    "git": {
      "sortByChanges": true,
      "sortByChangesMaxCommits": 100
    }
  },
  "include": [],
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    "useRepoignore": true,
    "customPatterns": []
  },
  "security": {
    "enableSecurityCheck": true
  },
  "tokenCount": {
    "encoding": "o200k_base"
  }
}
````

## File: src/app/(site)/sightings/realtime/page.tsx
````typescript
import {SightingsVisualization} from '@/features/data-viz/sightings/uap-dashboard/sightings-visualization'
import {SightingsGlobe} from '@/features/data-viz/sightings/sightings-globe'
import {UAPSightingSchema, type ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {Suspense} from 'react'
function transformToGeoJSON(sightings: ValidatedUAPSighting[])
import {getSightingsBatched} from '@/services/sightings/actions/sightings-time-chunk'
async function getSightings()
async function getMilitaryBases()
async function getUFOPosts()
````

## File: src/app/page.tsx
````typescript
import {Home} from '@/layouts/home'
import {Suspense} from 'react'
export default async function Index()
````

## File: src/components/ui/scroll-area.tsx
````typescript
import {cn} from '@/utils'
function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>)
⋮----
className=
⋮----
function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>)
````

## File: src/db/xata/xata.ts
````typescript
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";
⋮----
export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;
export type Topics = InferredTypes["topics"];
export type TopicsRecord = Topics & XataRecord;
export type Personnel = InferredTypes["personnel"];
export type PersonnelRecord = Personnel & XataRecord;
export type Events = InferredTypes["events"];
export type EventsRecord = Events & XataRecord;
export type Organizations = InferredTypes["organizations"];
export type OrganizationsRecord = Organizations & XataRecord;
export type Sightings = InferredTypes["sightings"];
export type SightingsRecord = Sightings & XataRecord;
export type EventSubjectMatterExperts =
  InferredTypes["event-subject-matter-experts"];
export type EventSubjectMatterExpertsRecord = EventSubjectMatterExperts &
  XataRecord;
export type TopicSubjectMatterExperts =
  InferredTypes["topic-subject-matter-experts"];
export type TopicSubjectMatterExpertsRecord = TopicSubjectMatterExperts &
  XataRecord;
export type OrganizationMembers = InferredTypes["organization-members"];
export type OrganizationMembersRecord = OrganizationMembers & XataRecord;
export type Testimonies = InferredTypes["testimonies"];
export type TestimoniesRecord = Testimonies & XataRecord;
export type TopicsTestimonies = InferredTypes["topics-testimonies"];
export type TopicsTestimoniesRecord = TopicsTestimonies & XataRecord;
export type Documents = InferredTypes["documents"];
export type DocumentsRecord = Documents & XataRecord;
export type Locations = InferredTypes["locations"];
export type LocationsRecord = Locations & XataRecord;
export type EventTopicSubjectMatterExperts =
  InferredTypes["event-topic-subject-matter-experts"];
export type EventTopicSubjectMatterExpertsRecord =
  EventTopicSubjectMatterExperts & XataRecord;
export type Users = InferredTypes["users"];
export type UsersRecord = Users & XataRecord;
export type UserSavedEvents = InferredTypes["user-saved-events"];
export type UserSavedEventsRecord = UserSavedEvents & XataRecord;
export type UserSavedTopics = InferredTypes["user-saved-topics"];
export type UserSavedTopicsRecord = UserSavedTopics & XataRecord;
export type UserSavedKeyFigure = InferredTypes["user-saved-key-figure"];
export type UserSavedKeyFigureRecord = UserSavedKeyFigure & XataRecord;
export type UserSavedTestimonies = InferredTypes["user-saved-testimonies"];
export type UserSavedTestimoniesRecord = UserSavedTestimonies & XataRecord;
export type UserSavedDocuments = InferredTypes["user-saved-documents"];
export type UserSavedDocumentsRecord = UserSavedDocuments & XataRecord;
export type UserTheories = InferredTypes["user-theories"];
export type UserTheoriesRecord = UserTheories & XataRecord;
export type UserSavedOrganizations = InferredTypes["user-saved-organizations"];
export type UserSavedOrganizationsRecord = UserSavedOrganizations & XataRecord;
export type UserSavedSightings = InferredTypes["user-saved-sightings"];
export type UserSavedSightingsRecord = UserSavedSightings & XataRecord;
export type Tags = InferredTypes["tags"];
export type TagsRecord = Tags & XataRecord;
export type Theories = InferredTypes["theories"];
export type TheoriesRecord = Theories & XataRecord;
export type Mindmaps = InferredTypes["mindmaps"];
export type MindmapsRecord = Mindmaps & XataRecord;
export type Artifacts = InferredTypes["artifacts"];
export type ArtifactsRecord = Artifacts & XataRecord;
export type CaseFiles = InferredTypes["case-files"];
export type CaseFilesRecord = CaseFiles & XataRecord;
export type DatabaseSchema = {
  topics: TopicsRecord;
  personnel: PersonnelRecord;
  events: EventsRecord;
  organizations: OrganizationsRecord;
  sightings: SightingsRecord;
  "event-subject-matter-experts": EventSubjectMatterExpertsRecord;
  "topic-subject-matter-experts": TopicSubjectMatterExpertsRecord;
  "organization-members": OrganizationMembersRecord;
  testimonies: TestimoniesRecord;
  "topics-testimonies": TopicsTestimoniesRecord;
  documents: DocumentsRecord;
  locations: LocationsRecord;
  "event-topic-subject-matter-experts": EventTopicSubjectMatterExpertsRecord;
  users: UsersRecord;
  "user-saved-events": UserSavedEventsRecord;
  "user-saved-topics": UserSavedTopicsRecord;
  "user-saved-key-figure": UserSavedKeyFigureRecord;
  "user-saved-testimonies": UserSavedTestimoniesRecord;
  "user-saved-documents": UserSavedDocumentsRecord;
  "user-theories": UserTheoriesRecord;
  "user-saved-organizations": UserSavedOrganizationsRecord;
  "user-saved-sightings": UserSavedSightingsRecord;
  tags: TagsRecord;
  theories: TheoriesRecord;
  mindmaps: MindmapsRecord;
  artifacts: ArtifactsRecord;
  "case-files": CaseFilesRecord;
};
⋮----
export class XataClient extends DatabaseClient<DatabaseSchema>
⋮----
constructor(options?: BaseClientOptions)
⋮----
export const getXataClient = () =>
````

## File: src/features/3d/scroll-through-3d/index.tsx
````typescript

````

## File: src/features/ai/components/ai-inputs/oracle-input.tsx
````typescript
import {AddIcon, OracleIcon, SlashIcon} from '@/components/icons'
import {MarkdownContent} from '@/components/ui/chat/markdown-content'
import {cn} from '@/utils/cn'
import {ICON_GREEN} from '@/utils/constants'
import {Brain} from 'lucide-react'
import {useCallback, useEffect, useRef} from 'react'
interface OracleInputProps {
  containerRef: any
  activeCommand: string | null
  inputValue: string
  setInputValue: (value: string) => void
  handleKeyDown: (e: KeyboardEvent) => void
  setIsOpen: (isOpen: boolean) => void
  inputRef: any
}
⋮----
const messagesContainerRef = useRef<HTMLDivElement>(null)
````

## File: src/features/case-files/stacked-cards/stacked-cards.stories.tsx
````typescript
import type {Meta, StoryObj} from '@storybook/react'
import {StackedCards} from './StackedCards'
⋮----
type Story = StoryObj<typeof meta>
````

## File: src/features/data-viz/sightings/sightings.tsx
````typescript
import {SightingsLoader} from './sightings-loader'
import {useState, useEffect, useCallback} from 'react'
import {HudUapInterface} from '@/features/data-viz/sightings/uap-dashboard/HudUapInterface'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
interface StatsType {
  totalSightings: number
  byType?: Record<string, number>
  byConfidence?: Record<string, number>
  byYear?: Record<string, number>
  [key: string]: number | Record<string, number> | undefined
}
interface SightingsClientProps {
  sightings: ValidatedUAPSighting[]
  events: any[]
  stats: StatsType
  analysis?: any
}
export const SightingsClient = (
````

## File: src/features/mindmap/components/note/menus/TextMenu/components/FontFamilyPicker.tsx
````typescript
import {DropdownButton, DropdownCategoryTitle} from '@/components/ui/Dropdown'
import {Icon} from '@/components/ui/Icon'
import {Surface} from '@/components/ui/Surface'
import {Toolbar} from '@/components/9-ui/toolbar'
⋮----
import {useCallback} from 'react'
⋮----
export type FontFamilyPickerProps = {
  onChange: (value: string) => void
  value: string
}
⋮----
onClick=
````

## File: src/features/mindmap/components/note/menus/TextMenu/components/FontSizePicker.tsx
````typescript
import {DropdownButton, DropdownCategoryTitle} from '@/components/ui/Dropdown'
import {Icon} from '@/components/ui/Icon'
import {Surface} from '@/components/ui/Surface'
import {Toolbar} from '@/components/9-ui/toolbar'
⋮----
import {useCallback} from 'react'
⋮----
export type FontSizePickerProps = {
  onChange: (value: string) => void
  value: string
}
export const FontSizePicker = (
⋮----
onClick=
````

## File: src/features/mindmap/nodes/user-input-node/user-input-node.tsx
````typescript
import {
  CoreNodeBottom,
  CoreNodeContainer,
  CoreNodeContent,
  CoreNodeTop,
} from '@/features/mindmap/nodes/core-node-ui'
import {useUser} from '@clerk/nextjs'
import {
  Handle,
  type NodeProps,
  Position,
  useUpdateNodeInternals,
  useNodesData,
  type Node,
} from '@xyflow/react'
import {memo, Suspense, use, useCallback, useEffect, useRef, useState} from 'react'
import {wait} from '@/utils'
import {AnimatedBeam, TextEffect} from '@/components/animated'
import {AiStarIcon} from '@/components/icons'
import {AddNote} from '@/components/note/AddNote'
import {useMindMap} from '@/contexts/mindmap'
import {Markdown} from '@/features/ai/components/prompt-kit/markdown'
import {useTextStream} from '@/features/ai/components/prompt-kit/response-stream'
import {WorldMap} from '@/features/data-viz/components/world-map/world-map'
import {AskAI, AskAIStreaming} from '@/features/mindmap/components/ask-ai'
import {useGroupNode} from '@/features/mindmap/hooks/useGroupNode'
import {useAskXata} from '@/features/mindmap/hooks/useAskXata'
import {Anchor} from '@/features/mindmap/nodes/user-input-node/anchor'
import {useEntity} from '@/hooks'
import type {Events} from '@/db/xata'
import {AnimatePresence, motion} from 'framer-motion'
import {Loader2, RefreshCw, Bug, List, MonitorCheck} from 'lucide-react'
import {useSSE} from '@/hooks/useSSE'
import {AnimatedMarkdown} from '@/features/mindmap/nodes/user-input-node/animated-markdown'
interface EntityData {
  id?: string
  data?: {
    name?: string
  }
}
interface AskQuestionParams {
  entities: string[]
  input: string
  type: string
}
interface NodeData {
  input?: string
  type?: string
  entities?: EntityData[]
  answer?: string
  isLoading?: boolean
  streamingAnswer?: string
  question?: string
  error?: string
  [key: string]: any
}
interface WorldMapDot {
  start: {lat: number; lng: number; label?: string}
  end: {lat: number; lng: number; label?: string}
}
⋮----
const getBeamProps = () =>
⋮----
const hasValidEntities = () =>
````

## File: src/services/ranking/README.md
````markdown
# Personnel Ranking System

## Overview

The Personnel Ranking System automatically calculates and maintains ranking scores for key figures (personnel) in the database by analyzing their connections across the knowledge graph.

## Key Features

- **Automated Analysis**: Daily calculation of importance and influence scores
- **Multiple Data Sources**: Analyzes connections across events, topics, organizations, testimonies, and documents
- **Normalized Scores**: Raw scores and percentile-based authority ranking
- **Configurable Weights**: Can be adjusted to prioritize different types of connections
- **Optimized Performance**: Uses Xata's aggregation methods for efficient data processing

## Technical Architecture

### Core Components

1. **Ranking Service** (`personnel-ranking.service.ts`)
   - Calculates scores with configurable weights
   - Uses Xata's aggregation methods for efficient data collection
   - Normalizes rankings and calculates percentiles
   - Updates personnel records in Xata database

2. **Scheduled Job** (Vercel Cron)
   - Daily execution at 2:00 AM UTC (configured in `vercel.json`)
   - Endpoint at `/api/cron/update-rankings`

3. **Admin APIs**
   - Manual Trigger: `/api/admin/trigger-ranking-update`
   - Testing: `/api/admin/test-ranking-system`

### How It Works

1. **Data Collection**: The system uses Xata's aggregation methods to efficiently collect connection data:
   - `aggregate()` with `count: "*"` to count all records matching a condition
   - `groupBy` to organize counts by personnel ID
   - Single database query per relationship type instead of per-person queries

2. **Score Calculation**: The core formula is:
   ```
   Rank Score = (
     (event_expert_count × EVENT_WEIGHT) +
     (topic_expert_count × TOPIC_WEIGHT) +
     (organization_member_count × ORG_WEIGHT) +
     (testimony_count × TESTIMONY_WEIGHT) +
     (document_count × DOCUMENT_WEIGHT) +
     (quote_count × QUOTE_WEIGHT)
   )
   ```

3. **Database Updates**: Stores two values for each personnel:
   - `rank`: Raw numerical score
   - `authority`: Percentile rank (0-100) compared to other personnel

4. **Statistics**: Uses Xata's `summarize()` method with operators like `average`, `count`, `max` and `min` for calculating aggregate statistics

## Usage Guide

### Automated Updates

Rankings automatically update daily via the Vercel cron job. No additional configuration is required.

### Manual Controls

To manually trigger a ranking update (e.g., after significant data changes):

```bash
# Using curl
curl -X POST https://your-domain.com/api/admin/trigger-ranking-update \
  -H "Authorization: Bearer dev_admin_token" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Custom Weights

You can adjust the weighting factors:

```bash
curl -X POST https://your-domain.com/api/admin/trigger-ranking-update \
  -H "Authorization: Bearer dev_admin_token" \
  -H "Content-Type: application/json" \
  -d '{
    "weights": {
      "EVENT_PARTICIPATION": 1.2,
      "TOPIC_EXPERTISE": 1.5,
      "ORGANIZATIONAL_ROLE": 0.8,
      "DOCUMENTED_EVIDENCE": 1.3,
      "TESTIMONY_COUNT": 1.0,
      "QUOTE_COUNT": 1.5
    }
  }'
```

### Testing Features

For testing the ranking system without affecting the database:

```bash
# Preview calculation without saving (dry run)
curl -X POST https://your-domain.com/api/admin/test-ranking-system \
  -H "Content-Type: application/json" \
  -d '{
    "dryRun": true,
    "weights": {
      "EVENT_PARTICIPATION": 1.2,
      "TOPIC_EXPERTISE": 1.0,
      "ORGANIZATIONAL_ROLE": 1.0,
      "DOCUMENTED_EVIDENCE": 1.0,
      "TESTIMONY_COUNT": 1.0,
      "QUOTE_COUNT": 1.5
    }
  }'

# Get current rankings and statistics
curl https://your-domain.com/api/admin/test-ranking-system
```

## Developer Notes

### Performance Optimizations

1. **Xata Aggregation Methods**
   - `aggregate()` with `count: "*"` for efficient relationship counting
   - `summarize()` with `average`, `min`, `max` operators for statistical calculations
   - These methods run calculations in the database instead of in memory
   - Significant reduction in database queries (from N per personnel to 5 total)

2. **Helper Utilities**
   - The `processAggregationResults()` function consolidates aggregation results efficiently
   - Pagination is used in endpoints returning large datasets

### Future Enhancements

1. **Logging Infrastructure**
   - Create a `ranking-logs` table in Xata
   - Comment out the implementation in `logRankingExecution()`

2. **Additional Metrics**
   - Add quotes/mentions when that table is implemented
   - Consider secondary connection influence (indirect references)

3. **Further Performance Optimization**
   - Consider using more complex aggregations for compound metrics
   - Add automated indexing of frequently queried fields

### Security Considerations

- In production, secure the admin endpoints with proper authentication
- Uncomment and configure the auth check in the cron endpoint
- Set up environment variables for API tokens

## Troubleshooting

- Check Vercel Function logs for execution details
- Use the test endpoint to diagnose ranking calculation issues
- For manual intervention, see the admin documentation
````

## File: src/services/resource-scrape/firecrawl.ts
````typescript
import { fireCrawl } from "@/lib/firecrawl";
import { EXTERNAL_RESOURCES } from "@/utils";
export enum ResearchDepth {
	SURFACE = "surface",
	MODERATE = "moderate",
	DEEP = "deep",
	COMPREHENSIVE = "comprehensive",
}
export enum ResearchCategory {
	SIGHTINGS = "sightings",
	TESTIMONIES = "testimonies",
	ARTIFACTS = "artifacts",
	ORGANIZATIONS = "organizations",
	PERSONNEL = "personnel",
	EVENTS = "events",
	THEORIES = "theories",
	LOCATIONS = "locations",
	PHENOMENA = "phenomena",
}
type DeepResearchOptions = {
	depth: ResearchDepth;
	categories: ResearchCategory[];
	recursiveLinks?: boolean;
	linkDepth?: number;
	extractionModel?: string;
	searchParams?: Record<string, string>;
	maxResults?: number;
};
export const scrapeWithFireCrawl = async ({
	url,
	formats = ["markdown", "extract", "screenshot"],
	extract = {
		prompt:
			"Extract all data related to Events, Topics, Key Figures, Sightings, Artifacts, Testimonies, and any other relevant information as it concerns UFO/UAP Phenomenon",
	},
}:
export const deepResearch = async (
	urls: string[],
	options: DeepResearchOptions,
) =>
export const scrapeAllExternalDisclosureResources = async () =>
export const crawlAllExternalDisclosureResources = async () =>
````

## File: src/services/sightings/actions/sightings-time-chunk.ts
````typescript
import { xata } from "@/db/xata/client";
import { UAPSightingSchema, type ValidatedUAPSighting } from "../uap-sighting";
interface XataAggregationResult {
	aggs?: {
		shapeDistribution?: Array<{
			value: string;
			count: number;
		}>;
		sightingsByYear?: Array<{
			value: string;
			count: number;
		}>;
		sightingsByLocation?: Array<{
			value: string;
			count: number;
		}>;
	};
}
interface XataRecord {
	id: string;
	date?: Date;
	description?: string;
	city?: string;
	state?: string;
	country?: string;
	shape?: string;
	latitude?: number;
	longitude?: number;
	media_link?: string;
	[key: string]: any;
}
function sanitizeXataRecord(record: XataRecord): Record<string, any>
function formatLocationString(
	city?: string,
	state?: string,
	country?: string,
): string
export async function getSightingsByTimeChunk(
	startYear = 1940,
	endYear: number = new Date().getFullYear(),
	limit = 100,
): Promise<ValidatedUAPSighting[]>
export async function getSightingsStats(
	startDateOrYear: Date | number = 1940,
	endDateOrYear: Date | number = new Date().getFullYear(),
): Promise<
export async function fetchSightingsRecords(
	startDateOrYear: Date | number = 1940,
	endDateOrYear: Date | number = new Date().getFullYear(),
	limit = 500,
): Promise<ValidatedUAPSighting[]>
export async function getSightingsBatched(
	timeRanges: Array<
		{ startYear: number; endYear: number } | { startDate: Date; endDate: Date }
	>,
	limit = 500,
): Promise<
````

## File: src/services/sightings/uap-monitor.ts
````typescript
interface RSSEntry {
	title: string;
	link: string;
	pubDate: string;
	description: string;
	source: string;
	category?: string[];
}
interface UAPSighting {
	id: string;
	source: "twitter" | "news" | "rss";
	title?: string;
	content: string;
	location: {
		city?: string;
		state: "NJ";
		coordinates?: {
			lat: number;
			lng: number;
		};
	};
	timestamp: Date;
	mediaUrls: string[];
	sourceUrl: string;
	category?: string[];
	confidence: "high" | "medium" | "low";
	type?: "sighting" | "incident" | "news" | "analysis";
}
⋮----
export class UAPMonitorService
⋮----
constructor()
async getAllSightings(): Promise<UAPSighting[]>
private async getTwitterSightings(): Promise<UAPSighting[]>
private async getNewsSightings(): Promise<UAPSighting[]>
private async getRSSSightings(): Promise<UAPSighting[]>
private categorizeAndEnrichSightings(
		sightings: UAPSighting[],
): UAPSighting[]
private categorizeContent(content: string): string[]
private determineConfidence(content: string): "high" | "medium" | "low"
private determineType(
		content: string,
): "sighting" | "incident" | "news" | "analysis"
private stripHtmlTags(html: string): string
private extractMediaUrls(content: string): string[]
private extractNJCity(text: string): string | undefined
````

## File: src/services/sightings/uap-sighting.ts
````typescript
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
type SightingProperty = string;
⋮----
export const isValidCoordinates = (coords: any): boolean =>
export const getValidCoordinates = (coords: any):
export const ensureValidCoordinates = (coords: any):
⋮----
export type ValidatedUAPSighting = z.infer<typeof UAPSightingSchema>;
export const getSightingsGeoJSON = async () =>
export function getSightingCoordinates(sighting: ValidatedUAPSighting | undefined | null):
export function createFallbackCoordinates(sighting: ValidatedUAPSighting | undefined | null):
````

## File: .gitignore
````
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

*storybook.log

# Added by Claude Task Master
# Logs
logs
*.log
dev-debug.log
# Dependency directories
node_modules/
# Environment variables
.env
# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
# OS specific
# Task files
tasks.json
tasks/
````

## File: tailwind.config.ts
````typescript
import type { Config } from "tailwindcss";
⋮----
function addVariablesForColors(
````

## File: src/app/(site)/explore/disclosure/page.tsx
````typescript
import {Suspense} from 'react'
import {MindMap} from '@/features/mindmap'
import {Loading} from '@/components/loaders/loading'
import {
  type NetworkGraphPayload,
  getEntityNetworkGraphData,
} from '@/features/mindmap/actions/get-entity-network-graph-data'
import {StateOfDisclosureProvider} from '@/contexts'
````

## File: src/app/api/admin/test-ranking-system/route.ts
````typescript
import { NextResponse } from "next/server";
import { calculatePersonnelRanking } from "@/services/ranking/personnel-ranking.service";
import { xata } from "@/db/xata/client";
⋮----
export async function GET()
interface WeightParams {
  EVENT_PARTICIPATION: number;
  TOPIC_EXPERTISE: number;
  ORGANIZATIONAL_ROLE: number;
  DOCUMENTED_EVIDENCE: number;
  TESTIMONY_COUNT: number;
  QUOTE_COUNT: number;
}
interface PersonMetrics {
  eventParticipation: number;
  topicExpertise: number;
  organizationalAuthority: number;
  documentedContributions: number;
  testimonies: number;
  quotes: number;
}
export async function POST(request: Request)
async function previewRankingCalculation(weights?: WeightParams)
async function gatherAllMetricsForPreview(): Promise<Record<string, PersonMetrics>>
⋮----
const processAggregationResults = (
    results: Record<string, unknown>[],
    idField: string,
    countField: string,
    metricField: keyof PersonMetrics
) =>
⋮----
function calculateScore(metrics: PersonMetrics, weights: WeightParams = DEFAULT_WEIGHTS): number
````

## File: src/app/api/disclosure/chat/route.ts
````typescript
import { askXataWithAi } from "@/db/xata/db/search-operations";
import { openai } from "@/lib/openai/client";
import { DISCLOSURE_ASSISTANT_ID } from "@/services/ai/openai/config";
import { assistantEventHandler } from "@/services/ai/openai/stream-handler";
import { NER_EXTRACTION_PROMPT } from "@/services/ai/prompts/ner-extraction-prompt";
import { AssistantResponse, streamText } from "ai";
import { xataToXYFlow } from "@/features/mindmap/actions/xata-to-xyflow";
import { searchDatabase } from "@/services/ai/openai/tools/search-database";
import { xata } from "@/db/xata/client";
import { streamObject } from "ai";
import { z } from "zod";
import { openai as openaiSdk } from "@ai-sdk/openai";
const transformForGraph = async (records: any[], prompt: string) =>
export async function POST(req: Request)
````

## File: src/app/layout.tsx
````typescript
import {ThemeProvider} from '@/contexts/theme-provider'
import {ClerkProvider} from '@clerk/nextjs'
import {FullSiteNav} from '@/components/navbar/full-site-nav'
import {lukasSans, monumentGrotesk, monumentGroteskMono, neueHaasGrotesk} from './fonts'
⋮----
export default function RootLayout(
````

## File: src/features/mindmap/components/menus/mindmap-side-menu.tsx
````typescript
import {
  FloatingPanelBody,
  FloatingPanelButton,
  FloatingPanelCloseButton,
  FloatingPanelContent,
  FloatingPanelFooter,
  FloatingPanelForm,
  FloatingPanelRoot,
  FloatingPanelSubmitButton,
  FloatingPanelTextarea,
  FloatingPanelTrigger,
} from '@/components/animated'
import {
  ArtifactsIcon,
  EventsIcon,
  KeyFiguresIcon,
  LayersIcon,
  OrganizationsIcon,
  TestimoniesIcon,
  TopicsIcon,
} from '@/components/icons'
import {Button} from '@/components/ui/button'
import {useMindMap} from '@/contexts/mindmap'
import {saveEventForUser} from '@/features/user/api/save-event'
import {ICON_GREEN} from '@/utils'
import {useAuth} from '@clerk/nextjs'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@radix-ui/react-tooltip'
import {AnimatePresence, motion} from 'framer-motion'
import {ArrowDown, FileSearch, Lightbulb, Plus} from 'lucide-react'
import {useCallback, useEffect, useRef, useState} from 'react'
import {ENTITY_TYPES, type MindMapNode} from './mindmap-bottom-menu'
import type {DatabaseSchema} from '@/db/xata'
import {xataToXYFlow} from '@/features/mindmap/actions/xata-to-xyflow'
export interface UserNode extends MindMapNode {
  type: 'userInputNode'
  data: {
    label: string
    input: string
    entities: MindMapNode[]
    type: string
  }
}
⋮----
e.preventDefault()
setIsOpen(false)
⋮----
// const model = objectMapToSingular[card?.type]
⋮----
const updateNote = (
⋮----
const handleSavingNote = () =>
const handleSubmit = () =>
⋮----
const handleClick = () =>
````

## File: src/features/mindmap/nodes/entity-node.tsx
````typescript
import {memo, useEffect, useState, useCallback, Suspense} from 'react'
import {Handle, Position, useNodesData, useUpdateNodeInternals} from '@xyflow/react'
import {AskAI} from '@/features/mindmap/components/ask-ai'
import {useEntity} from '@/hooks'
import {renderEntity} from '@/features/mindmap/components/cards/render-entity-card'
import type {FC, ReactElement} from 'react'
import {
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverForm,
  PopoverRoot,
  PopoverSubmitButton,
  PopoverTextarea,
  PopoverTrigger,
} from '@/components/animated'
import {AiStarIcon, ConnectionsIcon} from '@/components/icons'
import {AddNote} from '@/components/note/AddNote'
import {Button} from '@/components/ui/button'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {TestimonyCoreNodeBottom} from '@/features/mindmap/components/cards/testimony-card'
import {
  CoreNodeBottom,
  CoreNodeContainer,
  CoreNodeContent,
  CoreNodeTop,
} from '@/features/mindmap/nodes/core-node-ui'
import {ICON_GREEN, cn} from '@/utils'
import {Lightbulb} from 'lucide-react'
interface Photo {
  id: string
  name: string
  mediaType: string
  enablePublicUrl: boolean
  signedUrlTimeout: number
  uploadUrlTimeout: number
  size: number
  version: number
  url: string
}
export const IconMenuWrapper = (
type EntityType =
  | 'personnel'
  | 'organizations'
  | 'events'
  | 'artifact'
  | 'documents'
  | 'testimonies'
  | 'topics'
interface Analysis {
  text: string
  records: unknown[]
}
interface EntityNodeProps {
  id: string
  data: {
    type: EntityType
    handles?: string[]
    entities?: Array<{data: {name: string}}>
    input?: string
  }
}
````

## File: src/layouts/historical-events-timeline/historical-events-timeline.tsx
````typescript
import {GraphPaperBackground} from '@/components/backgrounds'
import type {EventsRecord} from '@/db/xata'
import {EventsTimeline} from '@/layouts/historical-events-timeline/events-timeline'
import {TimelineSidebar} from '@/layouts/historical-events-timeline/VerticalTimeline'
import {WorldMap} from '@/layouts/historical-events-timeline/world-map'
import {extractCoordinatesFromEvents, extractUniqueYearsFromEvents} from '@/utils'
import type {JSONData} from '@xata.io/client'
import {useMemo, useRef, useState} from 'react'
⋮----
import {SciFiGlobe} from './sci-fi-globe'
import {EventsGlobe} from './events-globe'
import {ThreeJSGlobe} from '@/components/globes/threejs-globe'
⋮----
const updateActiveLocation = (location: any) =>
⋮----
const updateCurrentYearIndex = (index: number) =>
const updateCurrentYear = (year: number) =>
⋮----
const createArcsData = () =>
````

## File: src/services/ranking/personnel-ranking.service.ts
````typescript
import { xata } from "@/db/xata/client";
interface RankingMetrics {
  eventParticipation: number;
  topicExpertise: number;
  organizationalAuthority: number;
  documentedContributions: number;
  testimonies: number;
  quotes: number;
}
interface WeightingFactors {
  EVENT_PARTICIPATION: number;
  TOPIC_EXPERTISE: number;
  ORGANIZATIONAL_ROLE: number;
  DOCUMENTED_EVIDENCE: number;
  TESTIMONY_COUNT: number;
  QUOTE_COUNT: number;
}
interface ExecutionLog {
  startTime: Date;
  endTime?: Date;
  recordsProcessed: number;
  maxScore: number;
  minScore: number;
  avgScore: number;
  status: 'processing' | 'completed' | 'failed';
  error?: string;
  executionTimeMs?: number;
  weightsUsed?: WeightingFactors;
}
⋮----
export async function calculatePersonnelRanking(weights = DEFAULT_WEIGHTS): Promise<ExecutionLog &
async function gatherAllMetrics(): Promise<Record<string, RankingMetrics>>
function calculateScore(metrics: RankingMetrics, weights: WeightingFactors): number
async function logRankingExecution(log: ExecutionLog): Promise<void>
````

## File: next.config.ts
````typescript

````

## File: src/app/(site)/sightings/page.tsx
````typescript
import {SightingsClient} from '@/features/data-viz/sightings/sightings'
import {Suspense} from 'react'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {getSightingsBatched} from '@/services/sightings/actions/sightings-time-chunk'
import {getEventsBatched} from '@/services/sightings/actions/events-time-chunk'
import {analyzeSightingsData} from '@/services/sightings/actions/sightings-ai-analysis'
import {getYear, subYears} from 'date-fns'
import {serializeXataRecords} from '@/utils/serialization'
interface SightingsStats {
  totalSightings: number
  byType?: Record<string, number>
  byConfidence?: Record<string, number>
  byYear?: Record<string, number>
  [key: string]: number | Record<string, number> | undefined
  timeRange: {
    startYear: number
    endYear: number
  }
}
interface SerializedSightingsResponse {
  sightings: ValidatedUAPSighting[]
  stats: {
    totalSightings: number
    byType: Record<string, number>
    byYear: Record<string, number>
    byLocation: Record<string, number>
    byConfidence?: Record<string, number>
    timeRange: {
      startYear: number
      endYear: number
    }
  }
}
interface EventData {
  id: string
  title?: string
  name?: string
  description: string
  location?: string
  date: Date
  latitude?: number
  longitude?: number
  category?: string
  sourceUrl?: string
  mediaUrls?: string[]
  images?: string[]
  createdAt?: Date
  updatedAt?: Date
}
interface SerializedEventsResponse {
  events: EventData[]
  stats: {
    total: number
    categoryDistribution: Array<{value: string; count: number}>
    timeseriesData: Array<{value: string; count: number}>
    locationData: Array<{
      location: string
      coordinates: {lat: number; lng: number} | null
      count: number
    }>
    timeRange: {
      startYear: number
      endYear: number
    }
  }
}
````

## File: src/features/data-viz/sightings/sightings-globe.tsx
````typescript
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	GeoJsonLayer,
	HexagonLayer,
	HeatmapLayer,
	ScatterplotLayer,
} from "deck.gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import ReactMapboxGl, {
	Layer,
	Feature,
	Popup,
	ZoomControl,
} from "react-mapbox-gl";
⋮----
import { format } from "date-fns";
import { scaleLog } from "d3-scale";
import AnimatedArcGroupLayer from "./animated-arc-group-layer";
import { AnimatedArcLayer } from "./animated-arc-layer";
import { useTimeSeriesAnimation } from "@/features/data-viz/sightings/useTimeSeriesAnimation";
import { useFilterWithBatching } from "./use-batched-processing";
⋮----
// Define path to external sightings geojson file
⋮----
function DeckGLOverlay(
⋮----
interface DeckProps {
	layers: any[];
	[key: string]: any;
}
interface SightingsGlobeProps {
	geoJSONSightings: {
		sightings: GeoJSON.FeatureCollection;
		militaryBases?: GeoJSON.FeatureCollection;
		ufoPosts?: GeoJSON.FeatureCollection;
	};
	useExternalData?: boolean;
}
interface FeatureInfo {
	coordinates: [number, number];
	properties: Record<string, any>;
}
interface GeoJSONFeature {
	geometry: {
		coordinates: [number, number];
		type: string;
	};
	properties: {
		date?: string | number;
		timestamp?: string | number;
		city?: string;
		location?: string;
		description?: string;
		comments?: string;
		sourceUrl?: string;
		[key: string]: any;
	};
	type: string;
}
⋮----
shape: "", // Filter by shape (e.g., 'cylinder', 'triangle', 'disc')
duration: 0, // Minimum duration in seconds
country: "", // Filter by country
state: "", // Filter by state/province
isSignificantEvent: false, // Show only major events
⋮----
// Determine if a sighting is a "significant event" based on properties
⋮----
const handleTimeRangeChange = (newRange: [number, number]) =>
⋮----
// Apply time filter to native Mapbox layer when time range changes
⋮----
// @ts-ignore - Access map differently depending on react-map-gl version
⋮----
// Ensure the map is fully initialized and has required methods
⋮----
// Cleanup function
⋮----
const getMapInstance = () =>
const handleMapLoad = () =>
const checkMapInstance = () =>
⋮----
const formatDate = (timestamp: number | string | undefined) =>
⋮----
style={"mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9"}
⋮----
console.log("Map style loaded");
⋮----
Time range:
````

## File: src/features/mindmap/graph.tsx
````typescript
import {Panel, ReactFlow} from '@xyflow/react'
import {GitGraph} from 'lucide-react'
import {edgeTypes} from '@/features/mindmap/config/edge-types'
import {nodeTypes} from '@/features/mindmap/config/index.config'
import {MindMapAnimatedClickMenu, MindMapSideMenu} from '@/features/mindmap/components/menus'
import {MindMapBottomMenu} from '@/features/mindmap/components/menus/mindmap-bottom-menu'
import {useContextMenu} from '@/hooks/useContextMenu'
import {CaseFilesAndEvidenceBoard} from '@/features/mindmap/components/status-ui/case-files-and-evidence-board'
import {GraphStatusLog} from '@/features/mindmap/components/status-ui/graph-status-log'
import {useMindMapStore} from '@/features/mindmap/store'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {useRef, useEffect} from 'react'
import {ThreadBoard} from '@/features/mindmap/components/status-ui/thread-board'
import {SessionNotes} from '@/features/mindmap/components/status-ui/session-notes'
import {useOthers} from '@liveblocks/react'
````

## File: CLAUDE.md
````markdown
# CLAUDE.md - Project Guidelines

## Build and Development Commands

- `bun dev` or `npm run dev` - Start development server
- `bun build` or `npm run build` - Build for production
- `bun lint` or `npm run lint` - Run ESLint
- `bun storybook` or `npm run storybook` - Launch Storybook
- `bun new` or `npm run new` - Use plop to scaffold components
- Testing: `bun vitest`, `bun vitest --browser`, `bun vitest --coverage`

## Code Style Guidelines

- Use TypeScript for all code; prefer interfaces over types
- Use functional components with React Server Components when possible
- Minimize `use client`, `useEffect`, and `setState`
- Follow Shadcn UI, Radix, and Tailwind for styling
- Use named exports for components and lowercase with dashes for directories
- Prefer early returns for better readability
- Use descriptive variable names with auxiliary verbs (isLoading, hasError)
- For event handlers, use "handle" prefix (handleClick, handleSubmit)
- Implement accessibility features (aria-labels, keyboard navigation)
- Optimize components with Suspense and dynamic loading
- Follow mobile-first responsive design with Tailwind
- Add the above to memory

## Project Documentation

- [README.md](./README.md) - Main project overview and introduction
- [Feature Roadmap](./apps/app/docs/roadmap.md) - Planned features and development timeline
- [ERD Diagram](./erd-diagram.mermaid) - Entity relationship diagram for the database
- `repomix-output.md`

## Claude Tasks

## Claude Tasks

### Research and Analysis

- **Deep Research**: Comprehensive extraction and analysis of entities from external content
  - See [Deep Research Extension Plan](docs/agent-notes/deep-research-extension-plan.md) for implementation details
  - Focuses on extracting new information and entities from external sources
  - Works with unstructured content that needs processing

- **Analysis**: Relationship discovery between selected entities in the mind map
  - Operates on internal data (nodes already in the mind map)
  - Focuses on understanding relationships between selected elements
  - Shows patterns, connections, and insights about the selected data

### Agent Architecture

The project implements a modular agentic architecture for orchestrating research and analysis tasks:

- **Agent Coordinator**: Orchestrates specialized agents for different tasks
- **Specialized Agents**: Content extraction, validation, relationship analysis
- **Process Definitions**: Structured workflows for research and analysis

For full implementation details, see the [Agentic Architecture Plan](docs/agent-notes/agentic-architecture-plan.md).

## AI Agent Roles

The project uses specialized AI agent roles to support different aspects of the platform:

1. **Historical Timeline Analyst** - Organizes chronological UFO events and identifies patterns
2. **Data Visualization Specialist** - Creates optimal visualizations for UFO/UAP data
3. **Claims & Evidence Evaluator** - Assesses credibility of testimonies and evidence
4. **Research Network Mapper** - Maps connections between people, events, and locations
5. **Documentation Librarian** - Curates and organizes UFO-related documentation

## Project Vision

For a comprehensive overview of the project vision and features, see the [project pitch document](docs/pitch.md) which outlines:

- Core data models (Events, Testimonies, Key Figures, Organizations, Topics, etc.)
- Interactive visualization capabilities
- Topic tracking and relationship mapping
- User contribution and community features
- Educational components and multimedia integration

The platform aims to be the definitive resource for tracking the state of UFO/UAP disclosure as it unfolds.
clau

**Project Summary:** *`./repomix-output.md`

- You are in charge of completing the personnel ranking system feature. Docs can be found here: .cursor/rules/features/personnel-ranking-system.mdc
````

## File: README.md
````markdown
# UltraTerrestrial

**Tracking the State of Disclosure**
_Striving to document, explore and disseminate the past, present and future of the UFO topic and its bearing on humanity, the universe and our place within it._

![Example Image](./preview.jpeg)

# Initial Idea

How it started ...

![Charlie Day](apps/app/docs/charlie-day.gif)

Essentially I was thinking it might be cool to build a "state of disclosure" application that provided engaging visual displays and interactions across the following general areas:

1. Major Historical UFO Event Chronology
    - Interactive 3D visualization of global UFO sightings
    - Timeline navigation and filtering capabilities
    - Detailed event documentation and analysis

2. Disclosure Status Dashboard
    - Real-time tracking of claims, hearings and news
    - Progress indicators and milestone tracking
    - Historical context and developments

3. Topic Analysis & Correlation Engine
    - Network visualization of connected topics
    - Pattern recognition and trend analysis
    - Machine learning-powered insight generation

4. Key Figures Database
    - Comprehensive profiles of notable individuals
    - Timeline of involvement and contributions
    - Network analysis of relationships and connections

5. Investigation Hub
    - Interactive evidence mapping and visualization
    - Collaborative research and analysis tools
    - Pattern recognition across disparate data points

6. Digital Archive
    - Searchable repository of documents and artifacts
    - Metadata tagging and cross-referencing
    - Chain of custody tracking

7. Open Questions Framework
    - Structured database of unresolved questions
    - Impact analysis and implications tracking
    - Progress monitoring and updates

8. Classified Locations Registry
    - Mapping of suspected facilities
    - Historical activity analysis
    - Geospatial correlation with events

9. Contractor Intelligence Database
    - Profiles of relevant organizations
    - Project and program tracking
    - Network analysis of relationships

## Formal Pitch

At its core, Ultraterrestrial is designed to chronicle major historical UFO events with stunning 3D visuals that map sightings across the globe. Picture an interactive world map where you can zoom in and out, explore sightings by location, and navigate through time using a dynamic slider that showcases how these phenomena have evolved over the decades. Heatmaps will highlight regions with high densities of sightings, and for those who love immersive experiences, augmented reality features will let you visualize historical sightings in your current surroundings.

Each event isn’t just a pinpoint on a map; it comes alive with detailed descriptions, eyewitness accounts, official reports, and multimedia elements like photos, videos, and audio recordings. Users can dive deep into geospatial data, view satellite imagery, and even add their own annotations, making the exploration both informative and interactive.

Keeping up with the latest developments is crucial, and Ultraterrestrial excels in status reporting on claims, hearings, news items, and events. A real-time dashboard offers an overview of recent developments, ongoing investigations, and upcoming events. Imagine visual timelines tracking the progression of key claims and hearings, complemented by a notification system that keeps you updated on specific topics or events you care about most.

One of the standout features is the Topic Tracker. This dynamic tool maps out interconnected topics using network graphs, highlighting trending subjects and organizing them into subtopics for easy navigation. Users can engage in discussions, participate in polls, and contribute their own insights, fostering a vibrant community of like-minded individuals.

No comprehensive platform would be complete without a Who’s Who roster, and Ultraterrestrial delivers with detailed profiles of key figures in the UFO disclosure space. From Bob Lazar to Jeremy Corbell, each profile includes biographies, contributions, claims, and multimedia content like interviews and documentaries. An interactive network map shows how these figures connect with each other, organizations, and major events, providing a clear picture of the landscape.

For those who crave deeper investigation, Ultraterrestrial offers an Investigative Hub. Think of it as a central place where you can follow complex threads weaving through various events, people, and evidence. Interactive diagrams and mind maps make it easy to visualize these connections, while in-depth case studies allow for thorough exploration of specific phenomena or incidents. Users can collaborate on investigations, contribute findings, and even participate in verifying information to ensure credibility.

The Library is another cornerstone of Ultraterrestrial, housing major documents, letters, artifacts, and evidence in a meticulously organized digital repository. With features like document scanning, OCR, and detailed metadata, users can easily search and access a wealth of information. Interactive exhibits and guided tours provide curated experiences, making the library both a resource and an educational tool.

Addressing the big questions is essential, and Ultraterrestrial presents an official list of “unanswered questions” along with their implications. These questions are categorized by themes such as technology, origin, and intent, and each one links to relevant people, places, and events. Users can track the progress of these questions, submit new ones, and vote on which should be prioritized, ensuring that the platform remains dynamic and responsive to community interests.

When it comes to the more mysterious aspects, Ultraterrestrial includes lists of suspected “black” bases and contractors involved in retrieving materials. Interactive maps provide detailed location data, while base profiles offer background information, theories, sightings, and photographic evidence. Contractor profiles document affiliations and evidence linking them to retrieved materials, complete with network mapping to show connections to various bases and events.

But Ultraterrestrial doesn’t stop at just providing information—it’s built to engage and empower its users. With community features like user accounts, profiles, forums, and user-generated content, the platform fosters a sense of belonging and collaboration. Users can upload their own sightings, participate in collaborative investigations, and contribute to the growing tapestry of ultraterrestrial knowledge.

Multimedia integration takes Ultraterrestrial to the next level, offering a rich video library with documentaries, interviews, and user-submitted footage. Exclusive podcasts and audio archives provide another layer of content, ensuring there’s always something new and engaging to explore.

Education is a key component, with interactive learning modules, quizzes, and expert webinars that help users deepen their understanding of UFO phenomena. Data analytics and insights offer trend analysis and predictive modeling, giving users a sophisticated toolset to interpret the vast amounts of data available.

Ultraterrestrial also emphasizes accessibility and inclusivity, supporting multiple languages and regional customization to reach a global audience. The platform is designed with accessibility in mind, featuring screen reader compatibility, keyboard navigation, and customizable UI options to ensure everyone can engage with the content comfortably.

In summary, Ultraterrestrial is poised to become the leading platform in the UFO disclosure space, offering a rich, interactive, and comprehensive experience that not only informs but also engages and empowers its users. Whether you’re an avid enthusiast, a dedicated researcher, or just curious about the mysteries of the skies, Ultraterrestrial provides the tools and community to explore the fascinating world of ultraterrestrial phenomena.

## Tech Stack

NextJS
Xata
OpenAI
Anthropic
Tailwind
ThreeJS
React Three Fiber
Framer Motion

[Feature Roadmap](./apps/app/docs/roadmap.md)

<https://app.warp.dev/session/c1fd1a4a-77ea-48e2-82a7-407d08dd182a?pwd=a0c7ef1c-c9e7-499d-802e-4e3795c77b4c>

### Prompt Storage

<https://us.cloud.langfuse.com/project/cm383h71b00ko9czugbg17ss6>

## TO DO

Add this <https://roadmap.hncore.website/>
````

## File: tsconfig.json
````json
{
	"compilerOptions": {
		"target": "es2020",
		"lib": ["dom", "dom.iterable", "esnext"],
		"allowJs": true,
		"skipLibCheck": true,
		"strict": true,
		"noImplicitAny": true,
		"strictNullChecks": true,
		"forceConsistentCasingInFileNames": true,
		"noEmit": true,
		"esModuleInterop": true,
		"module": "esnext",
		"moduleResolution": "bundler",
		"resolveJsonModule": true,
		"isolatedModules": true,
		"jsx": "preserve",
		"incremental": true,
		"baseUrl": ".",
		"plugins": [
			{
				"name": "next"
			}
		],
		"paths": {
			"@/*": ["./src/*"]
		}
	},
	"include": ["src", ".next/types/**/*.ts"],
	"exclude": ["node_modules"]
}
````

## File: src/contexts/mindmap/mindmap-context.tsx
````typescript
import type {MindMapContextType} from '@/contexts/mindmap/mindmap.interface'
import {useStateOfDisclosure} from '@/contexts/state-of-disclosure-provider'
import type {DatabaseSchema} from '@/db/xata'
import {
  BASE_ENTITY_NODE_HEIGHT,
  BASE_ENTITY_NODE_WIDTH,
  CHILD_DIMENSIONS,
  GROUP_NODE_DIMENSIONS,
  GROUP_NODE_LANDSCAPE,
  PADDING,
  ROOT_DIMENSIONS,
  ROOT_NODE_HEIGHT,
  ROOT_NODE_POSITIONS,
  ROOT_NODE_WIDTH,
  entityGroupNodeBaseConfig,
} from '@/features/mindmap/config/index.config'
import {
  type MindMapNode,
  fetchNextMindmapRecords,
} from '@/features/mindmap/actions/fetch-next-mindmap-records'
import type {MindMapState} from '@/features/mindmap/store'
import {useMindMapStore} from '@/features/mindmap/store'
import {use3DGraph} from '@/hooks/use3dGraph'
import {DOMAIN_MODEL_COLORS} from '@/utils'
import {capitalize} from '@/utils/functions'
import {
  type Edge,
  type Node,
  type XYPosition,
  useConnection,
  useEdges,
  useHandleConnections,
  useNodeConnections,
  useNodes,
  useNodesData,
  useReactFlow,
  useUpdateNodeInternals,
} from '@xyflow/react'
import type React from 'react'
import {createContext, useCallback, useContext, useEffect, useState} from 'react'
import {useShallow} from 'zustand/react/shallow'
import {xataToXYFlow} from '@/features/mindmap/actions/xata-to-xyflow'
import {organizeNodeLayout, LayoutOptions} from '@/features/mindmap/layouts/organizeNodeLayout'
export type RootNodeKey =
  | 'events-root-node'
  | 'personnel-root-node'
  | 'testimonies-root-node'
  | 'topics-root-node'
  | 'organizations-root-node'
  | 'documents-root-node'
  | 'artifacts-root-node'
  | 'case-files-root-node'
type FlowPosition = {
  x: number
  y: number
  zoom?: number
  duration?: number
}
type AddConnectionNodesFromSearchParams = {
  source: {
    id: string
    position?: XYPosition
    data?: Record<string, unknown>
    type?: string
  }
  searchResults: Array<{
    id?: string
    type?: string
    name?: string
    label?: string
    position?: XYPosition
    data?: Record<string, unknown>
  }>
}
const storeSelector = (store: MindMapState) => (
⋮----
export const MindMapProvider = (
⋮----
function calculateDiagonal(width: number, height: number)
function calculateCircumcircleRadius(width: number, height: number): number
⋮----
const restoreFlow = async () =>
⋮----
const enhancedOnConnect = (params: any) =>
⋮----
export const useMindMap = () =>
````

## File: src/features/mindmap/components/menus/mindmap-bottom-menu.tsx
````typescript
import {
  ArtifactsIcon,
  EventsIcon,
  KeyFiguresIcon,
  OracleIcon,
  OrganizationsIcon,
  TestimoniesIcon,
  TopicsIcon,
} from '@/components/icons/entity-icons'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {initiateDatabaseTableQuery} from '@/features/mindmap/actions/search'
import {DOMAIN_MODEL_COLORS, ICON_GREEN} from '@/utils/constants'
import {useAssistant} from '@ai-sdk/react'
import {useCallback, useEffect, useRef, useState} from 'react'
import {v4 as uuidv4} from 'uuid'
import {Command} from 'cmdk'
import {AnimatePresence, motion} from 'framer-motion'
import {AddIcon, ThinTwinklyStar} from '@/components/icons'
import {OracleInput, ToggleButton} from '@/features/ai/components/ai-inputs/oracle-input'
import {LightningBoltIcon} from '@radix-ui/react-icons'
import {TextShimmer} from '@/components/animated/text-effect'
import {MagicWandIcon} from '@/components/icons'
import {searchXataConnections} from '@/features/mindmap/actions/actions'
import {capitalize, cn} from '@/utils'
import {Brain, FileSearch, Lightbulb, SearchIcon, XIcon} from 'lucide-react'
import {
  askAIAction,
  xataToXYFlow,
  type XataToXYFlowResponse,
} from '@/features/mindmap/actions/xata-to-xyflow'
export interface MindMapNode {
  id: string
  type: string
  position: {x: number; y: number}
  data: Record<string, any>
  parentId?: string
}
export interface EntityType {
  type: string
  label: string
  displayName: string
  icon: (props?: React.SVGProps<SVGSVGElement>) => JSX.Element
  description: string
}
export interface SearchParams {
  type: string
  searchTerm: string
}
⋮----
const addDataToMindMap = (model: string) =>
⋮----
const toggleModelMenu = () =>
⋮----
// updateState( { isMenuOpen: true } )
⋮----
const closeModelMenu = () =>
⋮----
const removeActiveCommand = () =>
⋮----
const handleCommandSelect = (commandId: string) =>
const handleLoadingModelData = () =>
````
