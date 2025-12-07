import $ from 'jquery';
import * as bootstrap from 'bootstrap';
import model from '../../../lib/model.js';
import { ToastNotification } from './notifications.js';

/**
 * Contains graphical user interface and functionality for moving pieces
 * @class
 */
class SimpleBoardUI {
  /**
   * @param {Client} client - Client object in control of this UI
   */
  constructor(client) {
    this.client = client;
    this.match = null;
    this.rule = null;
    this.rotationAngle = [];
  }

  init() {
    this.container = $(`#${this.client.config.containerID}`);
    this.container.append($('#tmpl-board').html());
    this.container.append($('<div id="messages"></div>'));
    
    this.board = $('#board');
    this.fields = [];
    for (let i = 0; i < 4; i++) {
      this.fields[i] = $(`#field${i}`);
    }

    this.assignActions();
  }

  /**
   * Rounds down floating point value to specified number of digits
   * after decimal point
   * @param {Number} number - float number to round
   * @param {Number} digits - number of digits after decimal point
   * @returns {Number} rounded number as float
   */
  toFixedDown(number, digits) {
    if (number === 0) {
      return 0;
    }
    const n = number - Math.pow(10, -digits) / 2;
    const adjusted = n + n / Math.pow(2, 53); // added 1360765523: 17.56.toFixedDown(2) === "17.56"
    return adjusted.toFixed(digits);
  }

  /**
   * Show info notification
   * @param {string} message - Message to display
   * @param {number} timeout - Duration in milliseconds
   */
  notifyInfo(message, timeout = 3000) {
    ToastNotification.info(message, timeout);
  }

  /**
   * Show positive/success notification
   * @param {string} message - Message to display
   * @param {number} timeout - Duration in milliseconds
   */
  notifyPositive(message, timeout = 3000) {
    ToastNotification.success(message, timeout);
  }

  /**
   * Show negative/error notification
   * @param {string} message - Message to display
   * @param {number} timeout - Duration in milliseconds
   */
  notifyNegative(message, timeout = 3000) {
    ToastNotification.error(message, timeout);
  }

  /**
   * Show success notification
   * @param {string} message - Message to display
   * @param {number} timeout - Duration in milliseconds
   */
  notifySuccess(message, timeout = 3000) {
    ToastNotification.success(message, timeout);
  }

  /**
   * Show error notification
   * @param {string} message - Message to display
   * @param {number} timeout - Duration in milliseconds
   */
  notifyError(message, timeout = 3000) {
    ToastNotification.error(message, timeout);
  }

  getPointElem(pos) {
    return $(`#point${pos}`);
  }

  getPieceElem(piece) {
    return $(`#piece${piece.id}`);
  }

  getTopPieceElem(pos) {
    const pointElem = $(`#point${pos}`);
    if (pointElem.length) {
      return pointElem.find('div.piece').last();
    }
    return null;
  }

  getTopPiece(pos) {
    const pieceElem = this.getTopPieceElem(pos);
    if (pieceElem.length) {
      return pieceElem.data('piece');
    }
    return null;
  }

  getBarElem(type) {
    const barID = type === this.client.player.currentPieceType ? 'top-bar' : 'bottom-bar';
    return $(`#${barID}`);
  }

  getBarTopPieceElem(type) {
    const barElem = this.getBarElem(type);
    return barElem.find('div.piece').last();
  }

  getBarTopPiece(type) {
    const pieceElem = this.getBarTopPieceElem(type);
    if (pieceElem.length) {
      return pieceElem.data('piece');
    }
    return null;
  }

  getPieceByID(id) {
    return $(`#piece${id}`);
  }
  
  /**
   * Handles clicking on a point (position)
   */
  handlePointClick(e) {
    const game = this.match.currentGame;

    if (!model.Game.hasMoreMoves(game)) {
      return;
    }

    const movesLeft = game.turnDice.movesLeft;
    // If right mouse button was pressed, play last die value
    const steps = e.which === 3 ? movesLeft[movesLeft.length - 1] : movesLeft[0];
    const position = $(e.currentTarget).data('position');
    const piece = this.getTopPiece(position);
    if (piece) {
      this.client.reqMove(piece, steps);
    }
    e.preventDefault();
  }

  /**
   * Handles clicking on a bar
   */
  handleBarClick(e) {
    const game = this.match.currentGame;

    if (!model.Game.hasMoreMoves(game)) {
      return;
    }

    const movesLeft = game.turnDice.movesLeft;
    // If right mouse button was pressed, play last die value
    const steps = e.which === 3 ? movesLeft[movesLeft.length - 1] : movesLeft[0];
    const pieceElem = $(e.currentTarget).find('div.piece').last();
    const piece = pieceElem.data('piece');
    if (piece) {
      this.client.reqMove(piece, steps);
    }
    e.preventDefault();
  }
  
  /**
   * Assign actions to DOM elements
   */
  assignActions() {
    // Game actions
    $('#btn-roll').off('click').on('click', (e) => {
      this.client.reqRollDice();
    });

    $('#btn-confirm').off('click').on('click', (e) => {
      this.client.reqConfirmMoves();
    });

    $('#btn-undo').off('click').on('click', (e) => {
      this.client.reqUndoMoves();
    });

    $('#menu-undo').off('click').on('click', (e) => {
      const navbar = bootstrap.Collapse.getInstance(document.querySelector('#navbarContent'));
      if (navbar) navbar.hide();
      this.client.reqUndoMoves();
    });

    $('#menu-resign').off('click').on('click', (e) => {
      // Ask player if they want to resign from current game only or abandon the whole match
      const navbar = bootstrap.Collapse.getInstance(document.querySelector('#navbarContent'));
      if (navbar) navbar.hide();

      // Create Bootstrap 5 modal
      const modalHtml = `
        <div class="modal fade" id="resignModal" tabindex="-1" aria-labelledby="resignModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="resignModalLabel">Resign from game or match?</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p>Do you want to resign from the current game only, or abandon the entire match?</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-warning" id="resign-game-btn">Resign from Game</button>
                <button type="button" class="btn btn-danger" id="resign-match-btn">Resign from Match</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Remove existing modal if any
      $('#resignModal').remove();
      $('body').append(modalHtml);

      const modalElement = document.getElementById('resignModal');
      const modal = new bootstrap.Modal(modalElement);
      modal.show();

      $('#resign-game-btn').off('click').on('click', () => {
        this.client.reqResignGame();
        modal.hide();
      });

      $('#resign-match-btn').off('click').on('click', () => {
        this.client.reqResignMatch();
        modal.hide();
      });

      modalElement.addEventListener('hidden.bs.modal', () => {
        $('#resignModal').remove();
      });
    });
    
    if (!this.match || !this.match.currentGame || !this.client.player) {
      return;
    }

    // Actions for points
    for (let pos = 0; pos < 24; pos++) {
      const pointElem = this.getPointElem(pos);

      pointElem.on('contextmenu', (e) => {
        // Block browser menu
        e.preventDefault();
        return false;
      });
      pointElem.off('mousedown').on('mousedown', this.handlePointClick.bind(this));
    }

    // Actions for bar
    for (let pieceType = 0; pieceType <= model.PieceType.BLACK; pieceType++) {
      const barElem = this.getBarElem(pieceType);

      barElem.on('contextmenu', (e) => {
        // Block browser menu
        e.preventDefault();
        return false;
      });

      barElem.off('mousedown').on('mousedown', this.handleBarClick.bind(this));
    }
  }

  createPoint(field, pos, type) {
    const pointElem = $(`<div id="point${pos}" class="point ${type}"></div>`);
    pointElem.data('position', pos);
    field.append(pointElem);
  }

  createPoints() {
    /*
      Fields are numbered in the following way,
      no matter what pieces the user is playing with:
      - Field 0 - top left
      - Field 1 - bottom left
      - Field 2 - top right
      - Field 3 - bottom right
      
      Fields are arrange on the board in the following way:
      
      +12-13-14-15-16-17------18-19-20-21-22-23-+
      |                  |   |                  |
      |      Field 0     |   |      Field 2     |
      |                  |   |                  |
      |                  |   |                  |
      |                  |   |                  |
      |                  |   |                  |
      |                  |   |                  |
      |                  |   |                  |
      |                  |   |                  |
      |      Field 1     |   |      Field 3     |
      |                  |   |                  |
      +11-10--9--8--7--6-------5--4--3--2--1--0-+ -1
      
    */
    
    const pieceType = this.client.player.currentPieceType;
    let k;
    let typeClass;

    for (let i = 12; i < 18; i++) {
      typeClass = i % 2 === 0 ? 'even' : 'odd';
      k = pieceType === model.PieceType.BLACK ? i - 12 : i;
      this.createPoint(this.fields[0], k, typeClass);
    }

    for (let i = 11; i >= 6; i--) {
      typeClass = i % 2 === 0 ? 'even' : 'odd';
      k = pieceType === model.PieceType.BLACK ? i + 12 : i;
      this.createPoint(this.fields[1], k, typeClass);
    }

    for (let i = 18; i < 24; i++) {
      typeClass = i % 2 === 0 ? 'even' : 'odd';
      k = pieceType === model.PieceType.BLACK ? i - 12 : i;
      this.createPoint(this.fields[2], k, typeClass);
    }

    for (let i = 5; i >= 0; i--) {
      typeClass = i % 2 === 0 ? 'even' : 'odd';
      k = pieceType === model.PieceType.BLACK ? i + 12 : i;
      this.createPoint(this.fields[3], k, typeClass);
    }
  }

  createPiece(parentElem, piece, count) {
    const pieceTypeClass = piece.type === model.PieceType.WHITE ? 'white' : 'black';
    const pieceElem = $(`<div id="piece${piece.id}" class="piece ${pieceTypeClass}"><div class="image">&nbsp;</div></div>`);
    pieceElem.data('piece', piece);
    parentElem.append(pieceElem);
  }
  
  /**
   * Compact pieces in all positions
   */
  compactAllPositions() {
    for (let i = 0; i < 24; i++) {
      this.compactPosition(i);
    }
    this.compactElement(
      this.getBarElem(model.PieceType.WHITE),
      this.client.player.currentPieceType === model.PieceType.WHITE ? 'top' : 'bottom'
    );
    this.compactElement(
      this.getBarElem(model.PieceType.BLACK),
      this.client.player.currentPieceType === model.PieceType.BLACK ? 'top' : 'bottom'
    );
  }

  /**
   * Compact pieces in specific DOM element to make them fit vertically.
   * @param {jQuery} element - DOM element
   * @param {string} alignment - Alignment of pieces - 'top' or 'bottom'
   */
  compactElement(element, alignment) {
    const elementHeight = element.height();
    const itemCount = element.children().length;

    if (itemCount > 0) {
      const firstItem = element.children().first();
      const itemHeight = firstItem.width();
      let ratio = 100;
      const overflow = itemHeight * itemCount - elementHeight;

      if (overflow > 0 && itemHeight > 0 && itemCount > 1) {
        // Example:
        // itemHeight = 88
        // offset per item = 8
        // margin in percent = 100 - ((8 / 88) * 100)
        ratio = 100 - (overflow / (itemCount - 1) / itemHeight) * 100;
      }

      if (ratio > 100) {
        ratio = 100;
      }
      if (ratio <= 0) {
        ratio = 1;
      }

      element.children().each((i, el) => {
        const marginPercent = ratio * i;
        const negAlignment = alignment === 'top' ? 'bottom' : 'top';

        $(el).css(alignment, '0');
        $(el).css(`margin-${alignment}`, `${this.toFixedDown(marginPercent, 2)}%`);

        $(el).css(negAlignment, 'inherit');
        $(el).css(`margin-${negAlignment}`, 'inherit');
      });
    }
  }

  /**
   * Compact pieces in specific position to make them fit on screen vertically.
   * @param {Number} pos - Position of point
   */
  compactPosition(pos) {
    const pointElement = this.getPointElem(pos);
    const alignment =
      this.client.player.currentPieceType === model.PieceType.BLACK
        ? pos >= 0 && pos <= 11
          ? 'top'
          : 'bottom'
        : pos >= 12 && pos <= 23
          ? 'top'
          : 'bottom';

    this.compactElement(pointElement, alignment);
  }

  createPieces() {
    const game = this.match.currentGame;

    for (let pos = 0; pos < game.state.points.length; pos++) {
      const point = game.state.points[pos];
      for (let i = 0; i < point.length; i++) {
        const pointElem = this.getPointElem(pos);
        this.createPiece(pointElem, point[i], 0);
      }
      this.compactPosition(pos);
    }

    for (let b = 0; b < game.state.bar.length; b++) {
      const bar = game.state.bar[b];
      for (let i = 0; i < bar.length; i++) {
        const piece = bar[i];
        const barElem = this.getBarElem(piece.type);
        this.createPiece(barElem, piece, 0);
      }
    }
  }

  removePoints() {
    for (let i = 0; i < 4; i++) {
      this.fields[i].empty();
    }
  }

  removePieces() {
    const game = this.match.currentGame;

    for (let pos = 0; pos < game.state.points.length; pos++) {
      const pointElem = this.getPointElem(pos);
      pointElem.empty();
    }

    this.getBarElem(model.PieceType.BLACK).empty();
    this.getBarElem(model.PieceType.WHITE).empty();
  }

  /**
   * Reset board UI
   * @param {Match} match - Match
   * @param {Rule} rule - Rule
   */
  resetBoard(match, rule) {
    this.match = match;
    this.rule = rule;

    this.removePieces();
    this.removePoints();

    this.createPoints();
    this.createPieces();

    this.randomizeDiceRotation();

    this.assignActions();
    this.updateControls();
    this.updateScoreboard();

    this.compactAllPositions();
  }

  handleTurnStart() {
    this.randomizeDiceRotation();
  }

  handleEventUndoMoves() {
    this.notifyInfo('Player undid last move.');
  }

  handleEventGameRestart() {
    const yourscore = this.match.score[this.client.player.currentPieceType];
    const oppscore = this.match.score[this.client.otherPlayer.currentPieceType];
    const message = `Match result: <b>You ${yourscore}</b> / ${oppscore} Opponent`;
    const timeout = 5000;
    if (yourscore > oppscore) {
      this.notifyPositive(message, timeout);
    } else if (yourscore < oppscore) {
      this.notifyNegative(message, timeout);
    } else {
      this.notifyInfo(message, timeout);
    }
  }

  randomizeDiceRotation() {
    this.rotationAngle = [];
    for (let i = 0; i < 10; i++) {
      this.rotationAngle[i] = Math.random() * 30 - 15;
    }
  }

  updateControls() {
    if (!this.match || !this.match.currentGame) {
      $('#btn-roll').hide();
      $('#btn-confirm').hide();
      $('#btn-undo').hide();
      $('#menu-resign').hide();
      $('#menu-undo').hide();
      return;
    }

    const game = this.match.currentGame;

    $('#btn-roll').toggle(
      game.hasStarted &&
      !game.isOver &&
      model.Game.isPlayerTurn(game, this.client.player) &&
      !model.Game.diceWasRolled(game) &&
      !game.turnConfirmed
    );

    const canConfirmMove =
      game.hasStarted &&
      !game.isOver &&
      model.Game.isPlayerTurn(game, this.client.player) &&
      model.Game.diceWasRolled(game) &&
      !model.Game.hasMoreMoves(game) &&
      !game.turnConfirmed;

    const canUndoMove =
      game.hasStarted &&
      !game.isOver &&
      model.Game.isPlayerTurn(game, this.client.player) &&
      model.Game.diceWasRolled(game) &&
      !game.turnConfirmed;

    $('#btn-confirm').toggle(canConfirmMove);
    $('#btn-undo').toggle(canConfirmMove);

    $('#menu-resign').toggle(game.hasStarted && !game.isOver);
    $('#menu-undo').toggle(canUndoMove);

    const showDice =
      game.hasStarted && !game.isOver && model.Game.diceWasRolled(game) && !game.turnConfirmed;
    $('.dice-panel').toggle(showDice);

    if (showDice) {
      this.updateDice(game.turnDice, game.turnPlayer.currentPieceType);
    }
  }

  updateScoreboard() {
    if (!this.match || !this.match.currentGame) {
      return;
    }

    const isInMatch = !!this.match.currentGame;
    const matchText = isInMatch
      ? `Match "${this.rule.title}", ${this.match.length}/${this.match.length}`
      : 'Not in match';
    const matchTextTitle = isInMatch
      ? `Playing match with length of ${this.match.length} games and rule "${this.rule.title}"`
      : 'Match has not been started';
    $('#match-state').text(matchText);
    $('#match-state').attr('title', matchTextTitle);

    const yourscore = this.match.score[this.client.player.currentPieceType];
    $('#yourscore').text(yourscore);

    if (this.client.otherPlayer) {
      const oppscore = this.match.score[this.client.otherPlayer.currentPieceType];
      $('#oppscore').text(oppscore);
    } else {
      $('#oppscore').text('');
    }
  }
  
  showGameEndMessage(winner, resigned) {
    $('#game-result-overlay').show();

    const result = winner.id === this.client.player.id;
    let message;
    let matchState;

    if (resigned) {
      message = result ? 'Other player resigned!' : 'You resigned.';
    } else {
      message = result ? 'You WON!' : 'You lost.';
    }

    matchState = 'Match standing ';
    if (this.match.isOver) {
      message += ' Match is over.';
      matchState = 'Match result ';
    }

    const color = result ? 'green' : 'red';

    $('.game-result').css('color', color);
    $('.game-result .message').html(message);
    $('.game-result .state').html(matchState);

    const yourscore = this.match.score[this.client.player.currentPieceType];
    const oppscore = this.match.score[this.client.otherPlayer.currentPieceType];
    $('.game-result .yourscore').text(yourscore);
    $('.game-result .oppscore').text(oppscore);

    // Simple text fitting (replaces fitText)
    $('.game-result .text').each(function () {
      const $el = $(this);
      const fontSize = Math.min($el.width() / 10, $el.height() / 2);
      $el.css('font-size', `${fontSize}px`);
    });

    if (resigned) {
      this.notifyInfo('Other player resigned from game');
    }
  }

  /**
   * Updates the DOM element representing the specified die (specified by index).
   * Uses modern CSS-based dice display with 3D effects.
   * @param {Dice} dice - Dice to render
   * @param {number} index - Index of dice value in array
   * @param {PieceType} type - Player's type
   */
  updateDie(dice, index, type) {
    const color = type === model.PieceType.BLACK ? 'black' : 'white';
    const id = `#die${index}`;
    const value = dice.values[index];
    const $die = $(id);

    // Remove old classes
    $die
      .removeClass(
        'digit-1-white digit-2-white digit-3-white digit-4-white digit-5-white digit-6-white digit-1-black digit-2-black digit-3-black digit-4-black digit-5-black digit-6-black played black white rolling'
      )
      .addClass(color)
      .attr('data-value', value);

    // Add played state
    if (dice.movesLeft.length === 0) {
      $die.addClass('played');
    }

    // Add rotation animation
    const angle = this.rotationAngle[index];
    $die.css('transform', `rotate(${angle}deg)`);

    // Add rolling animation on first render
    if (!$die.hasClass('initialized')) {
      $die.addClass('rolling initialized');
      setTimeout(() => $die.removeClass('rolling'), 600);
    }
  }

  /**
   * Recreate DOM elements representing dice and render them in dice container.
   * Player's dice are shown in right pane. Other player's dice are shown in
   * left pane.
   * @param {Dice} dice - Dice to render
   * @param {PieceType} type - Player's type
   */
  updateDice(dice, type) {
    $('.dice').each(function () {
      $(this).empty();
    });

    // Player's dice are shown in right pane.
    // Other player's dice are shown in left pane.
    const diceElem =
      type === this.client.player.currentPieceType ? $('#dice-right') : $('#dice-left');

    for (let i = 0; i < dice.values.length; i++) {
      diceElem.append(`<span id="die${i}" class="die" data-value="${dice.values[i]}" aria-label="Die showing ${dice.values[i]}"></span>`);
      this.updateDie(dice, i, type);
    }

    $('.dice .die')
      .off('click')
      .on('click', (e) => {
        if (dice.movesLeft.length > 0) {
          model.Utils.rotateLeft(dice.values);
          model.Utils.rotateLeft(dice.movesLeft);
        }
        this.updateControls();
      });
  }

  async playActions(actionList) {
    for (let i = 0; i < actionList.length; i++) {
      const action = actionList[i];
      
      // Wait for previous action to complete
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 450));
      }

      if (action.type === model.MoveActionType.MOVE) {
        this.playMoveAction(action);
      } else if (action.type === model.MoveActionType.RECOVER) {
        this.playRecoverAction(action);
      } else if (action.type === model.MoveActionType.HIT) {
        this.playHitAction(action);
      } else if (action.type === model.MoveActionType.BEAR) {
        this.playBearAction(action);
      }
    }
  }

  playMoveAction(action) {
    if (!action.piece) {
      throw new Error('No piece!');
    }

    const pieceElem = this.getPieceElem(action.piece);
    const srcPointElem = pieceElem.parent();
    const dstPointElem = this.getPointElem(action.to);

    // Get source and destination positions for animation
    const srcRect = pieceElem[0].getBoundingClientRect();
    pieceElem.css({
      position: 'fixed',
      left: `${srcRect.left}px`,
      top: `${srcRect.top}px`,
      width: `${srcRect.width}px`,
      height: `${srcRect.height}px`,
      zIndex: 10000,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    });

    // Trigger reflow
    pieceElem[0].offsetHeight;

    // Move to destination
    const dstRect = dstPointElem[0].getBoundingClientRect();
    pieceElem.css({
      left: `${dstRect.left}px`,
      top: `${dstRect.top}px`,
    });

    // After animation completes
    setTimeout(() => {
      pieceElem.css({
        position: '',
        left: '',
        top: '',
        width: '',
        height: '',
        zIndex: '',
        transition: '',
      });
      pieceElem.detach();
      dstPointElem.append(pieceElem);
      this.compactPosition(srcPointElem.data('position'));
      this.compactPosition(dstPointElem.data('position'));
    }, 400);
  }

  playRecoverAction(action) {
    if (!action.piece) {
      throw new Error('No piece!');
    }

    const pieceElem = this.getPieceElem(action.piece);
    const srcPointElem = pieceElem.parent();
    const dstPointElem = this.getPointElem(action.position);

    // Animate recovery
    const srcRect = pieceElem[0].getBoundingClientRect();
    pieceElem.css({
      position: 'fixed',
      left: `${srcRect.left}px`,
      top: `${srcRect.top}px`,
      width: `${srcRect.width}px`,
      height: `${srcRect.height}px`,
      zIndex: 10000,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    });

    pieceElem[0].offsetHeight;

    const dstRect = dstPointElem[0].getBoundingClientRect();
    pieceElem.css({
      left: `${dstRect.left}px`,
      top: `${dstRect.top}px`,
    });

    setTimeout(() => {
      pieceElem.css({
        position: '',
        left: '',
        top: '',
        width: '',
        height: '',
        zIndex: '',
        transition: '',
      });
      pieceElem.detach();
      dstPointElem.append(pieceElem);
      this.compactElement(
        srcPointElem,
        action.piece.type === this.client.player.currentPieceType ? 'top' : 'bottom'
      );
      this.compactPosition(dstPointElem.data('position'));
    }, 400);
  }

  playHitAction(action) {
    if (!action.piece) {
      throw new Error('No piece!');
    }

    const pieceElem = this.getPieceElem(action.piece);
    const srcPointElem = pieceElem.parent();
    const dstPointElem = this.getBarElem(action.piece.type);

    // Animate hit with bounce effect
    const srcRect = pieceElem[0].getBoundingClientRect();
    pieceElem.css({
      position: 'fixed',
      left: `${srcRect.left}px`,
      top: `${srcRect.top}px`,
      width: `${srcRect.width}px`,
      height: `${srcRect.height}px`,
      zIndex: 10000,
      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      transform: 'scale(1)',
    });

    pieceElem[0].offsetHeight;

    // Add bounce animation
    pieceElem.css({
      transform: 'scale(1.2)',
    });

    setTimeout(() => {
      const dstRect = dstPointElem[0].getBoundingClientRect();
      pieceElem.css({
        left: `${dstRect.left}px`,
        top: `${dstRect.top}px`,
        transform: 'scale(1)',
      });

      setTimeout(() => {
        pieceElem.css({
          position: '',
          left: '',
          top: '',
          width: '',
          height: '',
          zIndex: '',
          transition: '',
          transform: '',
        });
        pieceElem.detach();
        dstPointElem.append(pieceElem);
        this.compactPosition(srcPointElem.data('position'));
        this.compactElement(
          dstPointElem,
          action.piece.type === this.client.player.currentPieceType ? 'top' : 'bottom'
        );
      }, 300);
    }, 150);
  }

  playBearAction(action) {
    if (!action.piece) {
      throw new Error('No piece!');
    }

    const pieceElem = this.getPieceElem(action.piece);
    const srcPointElem = pieceElem.parent();

    // Animate bearing off with fade out
    pieceElem.css({
      transition: 'all 0.5s ease-out',
      opacity: '0',
      transform: 'scale(0.5) translateY(-50px)',
    });

    setTimeout(() => {
      pieceElem.detach();
      this.compactPosition(srcPointElem.data('position'));
    }, 500);
  }

  /**
   * Compact pieces after UI was resized
   */
  resizeUI() {
    this.compactAllPositions();
  }
}

export default SimpleBoardUI;



